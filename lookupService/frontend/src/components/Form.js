import { useState, useEffect } from "react";
import { ChevronIkon, ForstorrelsesglassIkon } from '@sb1/ffe-icons-react'
import Spinner from '@sb1/ffe-spinner-react'
import { fetchTree, submitJob, getFamilies, getFamiliesIncludedInSearch, validData } from '../utils/Repository'
import { Redirect } from 'react-router-dom'
import Tree from './Tree'
import SearchableDropdown from './SearchableDropdown'
import OptionalSection from './OptionalSection'
import FamilyList from './FamilyList'

export const SearchForm = () => {
    // Form states
    const [optionalActive, setOptionalActive] = useState(false)
    const [modal, setModal] = useState(false)
    const [showIncluded, setShowIncluded] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    // Form data
    const [inputMode, setInputMode] = useState("text")
    const [node, setNode] = useState("")
    const [singleNode, setSingleNode] = useState(false)
    const [selectedFamily, setSelectedFamily] = useState("")
    const [singleFam, setSingleFam] = useState(false)

    const [redirect, setRedirect] = useState()

    // Tree data
    const [nodes, setNodes] = useState()
    const [edges, setEdges] = useState()

    // Family data
    const [families, setFamilies] = useState()
    const [includedFamilies, setIncludedFamilies] = useState()

    useEffect(() => {
        // disable modal after selection
        setModal(false)
    },[node])


    useEffect(() => {
        // fetch data upon page load
        const getData = async () => {
            let treeData = await fetchTree()
            let familyData = await getFamilies()
            setNodes(treeData.nodes)
            setEdges(treeData.edges)
            setFamilies(familyData)
        }
        getData()
    },[])

    const handleSubmit = async () => {
        setSubmitting(true)
        let mode = document.getElementById('mode').value
        let file
        if(mode == 'file'){
            file = document.getElementById('sequence').files[0]
            document.getElementById('sequence').value = ''
        }
        const data = {
            data: document.getElementById('sequence').value,
            mode: document.getElementById('mode').value,
            node: node,
            species: document.getElementById('species').value,
            model_type: document.getElementById('model').value,
            single_node: singleNode,
            single_fam_mode: singleFam,
            family: singleFam ? selectedFamily : '',
            mail_address: document.getElementById('email').value
        }

        if(validData(data, file)) {
            try {
                const response = await submitJob(data, file)
                setRedirect(response.id)
            } catch (e) {
                if (e.name == 'JobPostError') {
                    alert(e.message)
                }
                setSubmitting(false)
            }
        } else {
            alert('Required fields are missing')
            setSubmitting(false)
        }
    }

    const handleIncludedFamilyFetching = async (refresh) => {
        if(singleFam){
            setIncludedFamilies({families: [selectedFamily]})
        }
        else if(node){
            setIncludedFamilies(await getFamiliesIncludedInSearch(node, false, singleNode))
        }
        if(!refresh)
            setShowIncluded(!showIncluded)
    }

    const addDemoInput = () => {
        if(confirm('Are you sure you want to enter demo values?\nThis will overwrite current input')) {
            //setNode('Caenorhabditis')
            document.getElementById('species').value = ''
            setOptionalActive(true)
            document.getElementById('model').value = 'proto'
            setSingleNode(false)
            setSingleFam(true)
            setSelectedFamily('Let-7')
            document.getElementById('mode').value = 'text'
            document.getElementById('sequence').value = demoSequence
        }
    }

    return(
        <form className={'flex-column limit-width'}
              name={'query'} id={'query'} onSubmit={event => event.preventDefault()}>
            {modal && <Tree hook={setNode} show={setModal} nodes={nodes} edges={edges}/>}
            {submitting ? <span className={'default-margins'}>
                <Spinner className='spinner' large={true}/></span> :
            <>
            <span className={'input-cell'}>
                    <label className={'label'} htmlFor={'sequence'}>Sequence:</label>
                { inputMode === 'text' ?
                    <textarea id={'sequence'} name={'sequence'} rows={2}
                              placeholder={'Input sequence here'}/> :
                    <input
                        type={inputMode === 'file' ? 'file' : 'text'}
                        placeholder={`Input ${inputMode === 'link' ? 'link' : 'accession number'} here`}
                        name={'sequence'} accept={'.txt,.fa,.fasta'}
                        id={'sequence'}
                    />
                }
                </span>
            <span className={'input-cell'}>
                    <label className={'label'} htmlFor={'mode'}>Mode:</label>
                    <select id={'mode'} name={'mode'} onChange={event => {setInputMode(event.target.value)}}>
                        <option value={'text'}>Text input</option>
                        <option value={'file'}>File upload</option>
                        <option value={'link'}>Genome link</option>
                        <option value={'accNum'}>GenBank accession number</option>
                    </select>
                </span>
            <div className={'input-row'}>
                    <span className={'input-cell'}>
                        <label className={'label'} htmlFor={'species'}>Species:</label>
                        <input type={'text'} name={'species'} id={'species'} placeholder={'e.g. Caenorhabditis'}/>
                    </span>
                <span className={'input-cell'}>
                    <label className={'label'} htmlFor={'node'}>Node:</label>
                        <span className={'same-line'}>
                            <SearchableDropdown
                                data={nodes} selected={node}
                                setSelected={setNode} disabled={singleFam}
                                placeholder={'e.g. C elegans'} identifier={'node'}
                                displayParam={'text'} filterParam={'id'}
                            />
                            <span className={`button button--default default-margins ${singleFam ? 'disabled' : ''}`}
                                  onClick={() => {if(!singleFam) setModal(true)}}>Visualize</span>
                        </span>
                    </span>
            </div>
            <span className={'button button--action'} id={'submit'} onClick={() => {
                handleSubmit()
            }}>
                    Run MirMachine <ForstorrelsesglassIkon className={'icon icon--run'}/>
            </span>
            <span className={'input-row'}>
                <span className={'button button--default button__bigger'}
                      onClick={() => {setOptionalActive(!optionalActive)}}>
                        Optional params <ChevronIkon className={`icon icon--chevron ${optionalActive ? '' : 'icon--chevron__right'}`}/>
                </span>
                <span className={'button button--default button__bigger'} onClick={async () => {
                    handleIncludedFamilyFetching(false)
                    }}>
                    Included families <ChevronIkon className={`icon icon--chevron ${showIncluded ? '' : 'icon--chevron__right'}`}/>
                </span>
                <span className={'button button--default button__bigger'}
                        onClick={() => {addDemoInput()}}>
                    Demo parameters
                </span>
            </span>
            <OptionalSection
                optionalActive={optionalActive}
                singleFam={singleFam}
                setSingleFam={setSingleFam}
                setSingleNode={setSingleNode}
                selectedFamily={selectedFamily}
                setSelectedFamily={setSelectedFamily}
                singleNode={singleNode}
                families={families}
            />
            <FamilyList
                node={node}
                handleIncludedFamilyFetching={handleIncludedFamilyFetching}
                includedFamilies={includedFamilies}
                showIncluded={showIncluded}
            />
            </>}
            {redirect && <Redirect to={`/job/${redirect}`}/>}
        </form>
    )
}

const demoSequence = 'TTCTGTCTCCGGTAAGGTAGAAAATTGCATAGTTCACCGGTGGTAATATTCCAAACTATACAACCTACTACCTCACCGGATCCAC'