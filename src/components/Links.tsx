import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

class Links extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/declarations/list" className="navbar-brand">
                    Mon intermittence
                </Link>
                <div className="collpase navbar-collapse">
                    <div className="navbar-nav mr-auto">
                        <Item>
                            <Link to="/declarations/list" className="nav-link">
                                Récapitulatif
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/declarations/form" className="nav-link">
                                Ajouter déclaration
                            </Link>
                        </Item>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Links