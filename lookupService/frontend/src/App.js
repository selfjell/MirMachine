import { useEffect, useState } from 'react'
import { AboutPage } from './components/about/About'
import { SearchForm } from './components/form/Form'
import Job from './components/job/JobPage'
import Header from './components/frame/Header'
import Footer from './components/frame/Footer'
import Retrieval from './components/retrieval/Retrieval'
import Tree from './components/form/Tree'
import Result from './components/result/Result'
import { Switch, Route, useLocation } from 'react-router-dom'


const App = () => {
    const [activeHeader, setActiveHeader] = useState('/')
    let location = useLocation()

    useEffect(() => {
        setActiveHeader(location.pathname)
    }, [location])

  return (
    <div className="App">
      <Header activeHeader={activeHeader}/>
        <main className={'flex-column content'}>
            <Switch>
                <Route exact path={'/'} component={SearchForm}/>
                <Route path={'/about'} component={AboutPage}/>
                <Route path={'/job/:jobID'} component={Job}/>
                <Route path={'/retrieve'} component={Retrieval}/>
                <Route path={'/tree'} component={Tree}/>
                <Route path={'/result/:jobID'} component={Result}/>
            </Switch>
        </main>
        <Footer/>
    </div>
  );
}


export default App;
