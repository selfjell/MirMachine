#!/usr/bin/env bash
cat - | sort -k1,1V -k4,4n -k6,6n | awk '{if(NR==1) {chr=$1;x=$4;y=$5;b=$6;line=$0;endline=1;control=0;} 
                                                else {if(chr != $1 || y<$4) {print line;chr=$1;x=$4;y=$5;b=$6;line=$0;endline=1;control=0;} 
                                                else {if(b<$6) {chr=$1;x=$4;y=$5;b=$6;line=$0;endline=0;control=1;}}}}END{if(endline == 1) print line; if(control == 1) print line;}' |  awk 'BEGIN{print "short\tmirna\tchr"}match($0,/ID=([A-Z][a-z]+)-(([A-Z][a-z]+-[0-9]+)|(Bantam))[-|_]/,m){print tolower(m[1])"\t"m[2]"\t"$1}'