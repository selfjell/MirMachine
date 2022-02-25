import { Link } from "react-router-dom";


const Header = (props) => {
    return(
        <header className="App-header">
            <div className={'header-content'}>
                <img className={'default-margins mirmachine-logo'} src={'/static/assets/mirmachine-logo.png'}/>
                <Link to='/' className={`button button--header ${props.activeHeader==='/' ? 'button--header__active' : ''}`}>
                    Lookup Service
                </Link>
                <Link to={'/retrieve'} className={`button button--header ${props.activeHeader==='/retrieve' ? 'button--header__active' : ''}`}>
                    Ongoing job
                </Link>
                <Link to='/about' className={`button button--header ${props.activeHeader==='/about' ? 'button--header__active' : ''}`}>
                    About
                </Link>
            </div>
        </header>
    )
}

export default Header