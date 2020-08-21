import React, { useState } from 'react';
import backend from '../../../config/axios.config';
import CreateTask from './Create';
import Task from './Task';

const TasksList = (props) => {
    const [currentSubTab, setCurrentSubTab] = useState('task')
    const [items, setItems] = useState(props.items);

    const handleDelete = async (taskId) => {
        console.log('Delete task', taskId);
        backend.delete(`/tasks/${taskId}`)
            .then((response) => {
                if (response.status === 200) {
                    // Remove the task in state
                    setItems(items.filter((item) => item._id !== taskId));
                }
            });
    }

    const handleCreate = async (title, amount, type) => {
        const newTask = {
            title: title,
            amount: amount,
            type: type
        }
        backend.post(`/tasks`, newTask)
            .then((response) => {
                if (response.status === 200) {
                    // Spread the current tasks into the new array and attach the new task-
                    // we need the _id, so we have to insert the returned and newly inserted mongo object
                    setItems([...items, response.data.insertedObject]);
                }
            });
    }

    const handleCompleted = async (taskId) => {
        backend.patch(`/tasks/${taskId}/toggle`)
            .then((response) => {
                console.log([...items.filter((item) => item._id !== taskId), response.data.updatedObject]);
                //setItems([, response.data.updatedObject]);
            })
            .catch(err => {
                console.log('Error toggling task completed!');
            });
    }

    return (
        <div className="widget-container">
            <div className="header tasks">
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
            <div className="body tasks">
                {
                    items.map((element) => (
                        (element.type === currentSubTab) ? <Task
                            id={element._id}
                            title={element.title}
                            amount={element.amount}
                            key={element._id}
                            type={currentSubTab}
                            completed={element.completed}
                            onCompleted={handleCompleted}
                            onDelete={handleDelete}
                        />
                        : ''
                    ))
                }
                <CreateTask
                    type={currentSubTab}
                    onCreate={handleCreate}
                />
            </div>
        </div>
    )
}

export default TasksList;