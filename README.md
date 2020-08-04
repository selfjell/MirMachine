# miRmachine
Command line to tool detect miRNA homolog sequences.

Installation
------------
To create required environment using Anaconda:

```
conda env create -f environment.yaml
conda activate mirmachine
```

Quick start example
-------------------
```
git clone https://github.com/sinanugur/miRmachine.git
cd miRmachine
./miRmachine-main.py -n Caenorhabditis -s Caenorhabditis_elegans --genome data/genomes/ce11.fasta -m proto --cpu 20
```

Options and Arguments
---------------------
```
Usage:
    miRmachine-main.py --node <text> --species <text> --genome <text> [--model <text>] [--cpu <integer>]
    miRmachine-main.py (-h | --help)
    miRmachine-main.py --version

Arguments:
    -n <text>, --node <text>              Node name. (e.g. Caenorhabditis)
    -s <text>, --species <text>           Species name. (e.g. Caenorhabditis_elegans)
    -g <text>, --genome <text>            Genome fasta file location (e.g. data/genome/example.fasta)
    -m <text>, --model <text>             Model type: deutero, proto, combined [default: proto]
    -c <integer>, --cpu <integer>         CPUs. [default: 2]

Options:
    -h --help                          Show this screen.
    --version                          Show version.
```

Output
------
The `miRmachine` main executable will generate GFF annotations (filtered and unfiltered) and some other files.
