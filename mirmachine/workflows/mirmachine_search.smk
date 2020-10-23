# vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
from collections import defaultdict
import os.path
from yaml import load

genome=config['genome']
species=config['species']
node=config['node']
model=config.get('model','proto')
meta_directory=config.get('meta_directory','meta')
mirmachine_path=config.get('mirmachine_path','mirmachine')
mirna=[x.title() + ".PRE" for x in config['mirnas']]

cutoff_file=meta_directory + "/cutoffs/" + model + "/mirmachine_trusted_cutoffs.tsv"


#pull out CMs, I added this part to check ready models
#files, = glob_wildcards("analyses/cms/{files}.CM")

#mirna_from=config.get('read_mirnas_from_cm_folder','No')

#if mirna_from == "Yes":
#	mirna=files


#print (mirna)

cutoffs_dict=defaultdict(int)
with open(cutoff_file) as tsv:
	for line in tsv.readlines():
		cutoffs_dict[line.split()[0] + ".PRE"]=line.split()[1]



rule all:
	input:
		expand("results/predictions/gff/{species}.PRE.gff",species=species),
        expand("results/predictions/filtered_gff/{species}.PRE.gff",species=species),
		expand("results/predictions/heatmap/{species}.heatmap.tsv",species=species),
		expand("results/predictions/fasta/{species}.PRE.fasta",species=species)

rule prepare_genome:
	input:
		genome
	output:
		"data/genomes/" + species + ".fai",
		"data/genomes/" + species + ".size"
		#genome + ".fai",
		#genome + ".size"
	shell:
		"""
		samtools faidx {input};
		mv {genome}.fai {output[0]};
		cut -f1,2 {output[0]} > {output[1]};
		"""
rule search_CM:
	input:
		meta_directory + "/cms/" + model + "/{mirna}.CM"
	output:
		"analyses/output/{species}/{mirna}.result"
	threads: 15
	shell:
		"""
		cmsearch --cpu {threads} {input} {genome} > {output}

		"""
rule parse_output:
	input:
		"analyses/output/{species}/{mirna}.result",
		"data/genomes/" + species + ".size"
		#genome + ".size"
	output:
		"analyses/output/{species}/{mirna}.gff",
		temp("analyses/output/{species}/{mirna}.ext.gff"),
		"analyses/output/{species}/{mirna}.unfiltered"

	params:
		parse=""" 'match($0,/\([0-9]+\)\s+!\s+.*/,m){{if($9 =="+") {{start=$7;end=$8}} else {{start=$8;end=$7}}; print $6"\tcmsearch\tncRNA\t"start"\t"end"\t"$4"\t"$9"\t.\tgene_id="id";E-value="$3}}' """,

	shell:
		"""
		#parse the result file into GFF file
		awk '{{print}} /Hit alignments/ {{exit}}' {input[0]} | gawk -v id={wildcards.mirna} {params.parse} > {output[0]}
		bedtools slop -i {output[0]} -g {input[1]} -b 30 > {output[1]}

		#write the sequences into the GFF file
		paste --delimiters=";" {output[0]} <(bedtools getfasta -tab -s -fi {genome} -bed {output[1]} | awk '{{print "sequence_with_30nt="$2}}') > {output[2]}

		#sort and filter overlapping
		{mirmachine_path}/gff_sort_and_compete.sh {output[2]} > {output[0]}
		"""




rule create_filtered_gffs:
	input:
		"analyses/output/{species}/{mirna}.gff",
		cutoff_file
	output:
		temp("analyses/output/{species}/{mirna}.filtered.gff")

	params:
		trusted=lambda wildcards: cutoffs_dict[wildcards.mirna]
	
	run:
		shell("cat {input[0]} | awk -v trusted={params.trusted} '$6 >= trusted{{print}}' > {output}")

rule fastas:
	input:
		"analyses/output/{species}/{mirna}.gff",
		cutoff_file
	output:
		temp("analyses/output/{species}/{mirna}.filtered.fasta")
	params:
		trusted=lambda wildcards: cutoffs_dict[wildcards.mirna]
	shell:
		"""
		paste <(cat {input[0]} | gawk -v id={wildcards.mirna} -v trusted={params.trusted} '{{if($6 >= trusted) o="HIGHconf"; else o="LOWconf"; print ">"id"_"$1"_"$4"_"$5"_("$7")_"o}}') <(bedtools getfasta -tab -s -fi {genome} -bed {input[0]} | awk '{{print $2}}') | awk '{{print $1"\\n"$2}}' > {output}

		"""
		
rule combine_fastas:
	input:
		expand("analyses/output/{species}/{mirna}.filtered.fasta",species=species,mirna=mirna)
	output:
		"results/predictions/fasta/{species}.PRE.fasta"
	run:
		shell("cat analyses/output/{wildcards.species}/*filtered.fasta > {output}")


rule combine_gffs:
	input:
		expand("analyses/output/{species}/{mirna}.gff",species=species,mirna=mirna)
	output:
		"results/predictions/gff/{species}.PRE.gff"
	run:
		shell("cat analyses/output/{wildcards.species}/*PRE.gff | grep PRE > {output}")

rule combine_filtered_gffs:
	input:
		expand("analyses/output/{species}/{mirna}.filtered.gff",species=species,mirna=mirna)
	output:
		"results/predictions/filtered_gff/{species}.PRE.gff"
	run:
		shell("cat analyses/output/{wildcards.species}/*PRE.filtered.gff | grep PRE > {output}")


rule create_heatmap_csv:
	input:
		"results/predictions/gff/{species}.PRE.gff",
		"results/predictions/filtered_gff/{species}.PRE.gff"
	output:
		temp("results/predictions/gff/{species}.csv"),
		temp("results/predictions/filtered_gff/{species}.csv"),
		"results/predictions/heatmap/{species}.heatmap.tsv"
	shell:
		"""
		gawk '{{match($0,"gene_id=(.*).PRE",m); print m[1]}}' {input[0]} | sort | uniq -c | awk '{{print $2"\t"$1}}' > {output[0]}
		gawk '{{match($0,"gene_id=(.*).PRE",m); print m[1]}}' {input[1]} | sort | uniq -c | awk '{{print $2"\t"$1}}' > {output[1]}
		join -a 1 {output[0]} {output[1]} | awk -v species={wildcards.species} -v node={node} '{{print species,node,$0}}' > {output[2]}
		"""

