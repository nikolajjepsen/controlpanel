import React from 'react';
import { Link } from 'react-router-dom';

import {
	Home as HomeIcon,
	List as ListIcon,
	Mail as MailIcon,
	Calendar as CalendarIcon,
} from 'react-feather';

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
					<Link className="nav__button" to="/tasks" aria-label="Tasks">
						<ListIcon size={34} strokeWidth={1.1} />
					</Link>
				</li>
				<li className="nav__item">
					<Link className="nav__button" to="/email" aria-label="Email">
						<MailIcon size={34} strokeWidth={1.1} />
					</Link>
				</li>
				<li className="nav__item">
					<Link className="nav__button" to="/email" aria-label="Calendar">
						<CalendarIcon size={34} strokeWidth={1.1} />
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
