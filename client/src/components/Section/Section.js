import React from 'react';
import { Row } from 'react-bootstrap';
import './Section.scss';

const Section = ({ children, className, title }) => {
	return (
		<div className={`section ${className ? className : ''}`}>
			{title && <h3 className="section-title">{title}</h3>}
			<Row>{children}</Row>
		</div>
	);
};

export default Section;
