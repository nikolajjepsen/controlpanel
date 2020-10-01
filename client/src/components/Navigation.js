import React from 'react';
import { Link } from 'react-router-dom';

import { Home as HomeIcon, List as ListIcon } from 'react-feather';

import './Navigation.scss';

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li className="nav__item">
                    <Link className="nav__button" to="/" aria-label="Home">
                        <HomeIcon size={34} strokeWidth={1.1} />
                    </Link>
                </li>
                <li className="nav__item">
                    <Link className="nav__button" to="/planning" aria-label="Tasks">
                        <ListIcon size={34} strokeWidth={1.1} />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
