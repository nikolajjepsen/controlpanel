import React, { useState, useEffect } from 'react';
import backend from '../../config/axios.config';
import TaskCreate from './TaskCreate';
import TaskItem from './TaskItem';

import './Task.scss';
import LoadingIndicator from '../LoadingIndicator';

const TasksList = () => {
    const [currentSubTab, setCurrentSubTab] = useState('task');
    const [items, setItems] = useState(false);
    const [isLoading, setIsLoading] = useState();

    useEffect(() => {
        setIsLoading(true);
        const fetchTasks = async () => {
            try {
                const tasks = await backend.get('/tasks/');
                setItems(tasks.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching to-do tasks & shopping list: ' + error);
            }
        };
        fetchTasks();
    }, []);

    const handleDelete = async (taskId) => {
        console.log('Delete task', taskId);
        backend.delete(`/tasks/${taskId}`).then((response) => {
            if (response.status === 200) {
                setItems(items.filter((item) => item._id !== taskId));
            }
        });
    };

    const handleCreate = async (title, amount, type) => {
        const newTask = {
            title: title,
            amount: amount,
            type: type,
        };
        backend.post(`/tasks`, newTask).then((response) => {
            if (response.status === 200) {
                setItems([...items, response.data.insertedObject]);
            }
        });
    };

    const handleCompleted = async (taskId) => {
        try {
            await backend.patch(`/tasks/${taskId}/toggle`);
            setItems(
                items.map((task) =>
                    task._id === taskId ? { ...task, completed: !task.completed } : task,
                ),
            );
        } catch (err) {
            console.error(err);
        }
    };

    const NoItems = () => {
        return (
            <div class="no-items">
                <b>No items found</b>
                <p>Start adding new {currentSubTab} items below.</p>
            </div>
        );
    };

    return (
        <div className="tasks">
            <div className="navigation">
                <h2
                    className={`nav${currentSubTab === 'task' ? ' active' : ''}`}
                    onClick={() => setCurrentSubTab('task')}
                >
                    Tasks
                </h2>

                <h2
                    className={`nav${currentSubTab === 'shopping' ? ' active' : ''}`}
                    onClick={() => setCurrentSubTab('shopping')}
                >
                    Shopping
                </h2>
            </div>
            <div className="list">
                {!isLoading &&
                    items &&
                    items.map((element) =>
                        element.type === currentSubTab ? (
                            <TaskItem
                                id={element._id}
                                title={element.title}
                                amount={element.amount}
                                key={element._id}
                                type={currentSubTab}
                                completed={element.completed}
                                onCompleted={handleCompleted}
                                onDelete={handleDelete}
                            />
                        ) : (
                            ''
                        ),
                    )}
                {(isLoading || !items) && <LoadingIndicator />}
                {!isLoading && items.length === 0 && <NoItems />}
                <TaskCreate type={currentSubTab} onCreate={handleCreate} />
            </div>
        </div>
    );
};

export default TasksList;
