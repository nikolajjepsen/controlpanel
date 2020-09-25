import React, { useState } from 'react';

const CreateTask = (props) => {
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [newTaskAmount, setNewTaskAmount] = useState('');

	const handleCreate = () => {
		props.onCreate(newTaskTitle, newTaskAmount, props.type);
		setNewTaskTitle('');
		setNewTaskAmount('');
	};

	return (
		<div className={`item ${props.type} create-new`}>
			<div className="title-container">
				<input
					type="text"
					name="title"
					value={newTaskTitle}
					placeholder="Add new task"
					onChange={(event) => setNewTaskTitle(event.target.value)}
				/>
			</div>
			{props.type === 'shopping' && (
				<div className="amount">
					<input
						type="text"
						name="amount"
						value={newTaskAmount}
						placeholder="Amount to buy"
						onChange={(event) => setNewTaskAmount(event.target.value)}
					/>
				</div>
			)}
			<div className="submit-container">
				<input
					type="submit"
					value="Create task"
					onClick={() => {
						handleCreate();
					}}
				/>
			</div>
		</div>
	);
};

export default CreateTask;
