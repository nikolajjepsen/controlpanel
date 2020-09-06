import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ButtonList, Button } from '../Button/Button';

import backend from '../../config/axios.config';

import EmailList from './Emails/EmailList.js';
import CalendarList from './Calendar.js';
import TasksList from './Tasks/List.js';
import './Widgets.css';

const Widgets = ({ authorizations }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState('tasks');
    const [widgetData, setWidgetData] = useState(null);

    const determineEndpoint = () => {
        let endpoint = '';
        switch (currentTab) {
            case 'tasks':
                endpoint = '/tasks';
                break;
            case 'shopping':
                endpoint = '/tasks';
                break;
            case 'email':
                endpoint = '/google/emails/10';
                break;
            case 'calendar':
                endpoint = '/google/calendar';
                break;
            default:
                endpoint = '/tasks'
                break;
        }
        return endpoint;
    }

    const Navigation = () => {
        return (
            <ButtonList listClass="widgets">
                <Button
                    buttonClass="widget"
                    buttonSize=""
                    isActive={currentTab === 'tasks'}
                    isLoading={currentTab === 'tasks' && isLoading}
                    icon={
                        <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                    }
                    onClick={() => setCurrentTab('tasks')}
                />
                {
                    authorizations.includes('google') &&
                    <>
                        <Button
                            buttonClass="widget"
                            buttonSize=""
                            isActive={currentTab === 'email'}
                            isLoading={currentTab === 'email' && isLoading}
                            icon={
                                <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            }
                            onClick={() => setCurrentTab('email')}
                        />
                        <Button
                            buttonClass="widget"
                            buttonSize=""
                            isActive={currentTab === 'calendar'}
                            isLoading={currentTab === 'calendar' && isLoading}
                            icon={
                                <svg viewBox="0 0 24 24" width="40" height="40" stroke="currentColor" strokeWidth="0.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            }
                            onClick={() => setCurrentTab('calendar')}
                        />
                    </>
                }
            </ButtonList>
        );
    }

    const RenderLoading = () => {
        return (
            ''
        )
    }

    useEffect(() => {
        setIsLoading(true);
        backend.get(determineEndpoint())
            .then((response) => {
                setWidgetData(response.data);
                setIsLoading(false);
            });
    }, [currentTab])

    return (
        <Row>
            <Col>
                <Navigation />
                {
                    currentTab === 'tasks' &&
                    (isLoading ? RenderLoading() : <TasksList items={widgetData} />)
                }
                {
                    currentTab === 'email' &&
                    (isLoading ? RenderLoading() : <EmailList items={widgetData} />)
                }
                {
                    currentTab === 'calendar' &&
                    (isLoading ? RenderLoading() : <CalendarList items={widgetData} />)
                }
            </Col>
        </Row>
    );


}

export default Widgets;