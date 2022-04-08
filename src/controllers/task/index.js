import Project from '../../models/Project.js';
import Task from '../../models/Task.js';

/**
 * Get tasks
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getTasks = async (req, res, next) => {
	let jsonResponse, status, tasks;
	const { decodedToken } = req;
	jsonResponse = {
		details: {},
		msg: 'All tasks',
		tasks: [],
	};
	try {
		tasks = await Task.find();
		jsonResponse.tasks = tasks;
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Get task
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getTask = async (req, res, next) => {
	let jsonResponse, status;
	const { taskData } = req;
	jsonResponse = {
		details: {},
		msg: 'Task data',
		task: {},
	};
	try {
		jsonResponse.task = taskData;
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Get task by project _id
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getTasksByProjectId = async (req, res, next) => {
	let jsonResponse, status, tasks;
	const { params: { id }, decodedToken } = req;
	jsonResponse = {
		details: {},
		msg: 'Tasks by project id',
		tasks: {},
	};
	try {
		tasks = await Task.find().where('project').equals(id);
		jsonResponse.tasks = tasks;
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Update task
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const updateTask = async (req, res, next) => {
	let jsonResponse, status, task;
	const { body, taskData } = req;
	jsonResponse = {
		details: {},
		msg: 'Task updated',
		task: {},
	};
	try {
		task = await Task.findById(taskData._id);
		task.name = body.name || task.name;
		task.description = body.description || task.description;
		task.timeline = body.timeline || task.timeline;
		task.priority = body.priority || task.priority;
		await task.save();
		jsonResponse.task = task;
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Delete task
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const deleteTask = async (req, res, next) => {
	let jsonResponse, status;
	const { taskData } = req;
	jsonResponse = {
		details: {},
		msg: 'Task deleted',
		task: {},
	};
	try {
		await Task.deleteOne({ _id: taskData._id });
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Create task
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const createTask = async (req, res, next) => {
	let jsonResponse, status, task;
	const { body, projectData } = req;
	jsonResponse = {
		details: {},
		msg: 'Task created',
		task: {},
	};
	try {
		task = new Task(body);
		task.project = projectData._id;
		await task.save();
		jsonResponse.task = task;
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Update task status
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const updateTaskStatus = async (req, res, next) => {
	let jsonResponse, status, tasks;
	jsonResponse = {
		details: {},
		msg: 'Task status updated',
		task: {},
	};
	try {
		status = 200;
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if project exist by it's _id
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askProjectExistById = async (req, res, next) => {
	let jsonResponse, status, project;
	const { body } = req;
	jsonResponse = {
		details: {},
		msg: 'Project not found',
		project: {},
	};
	try {
		project = await Project.findById(body.project);
		if (project) {
			req.projectData = project;
			return next();
		} else {
			status = 404;
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if the project belongs to the current logged user
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askProjectOwnership = async (req, res, next) => {
	let jsonResponse, status;
	const { projectData, decodedToken: { id } } = req;
	jsonResponse = {
		details: {},
		msg: 'Project',
		project: {},
	};
	try {
		if (projectData.owner.toString() !== id.toString()) {
			delete req.projectData;
			jsonResponse.msg = 'Permission denied. You do not own this project';
			status = 401;
		} else {
			return next();
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if the task exist by it's _id
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askTaskExistById = async (req, res, next) => {
	let jsonResponse, status, task;
	const { params: { id } } = req;
	jsonResponse = {
		details: {},
		msg: 'Task not found',
		task: {},
	};
	try {
		task = await Task.findById(id).populate('project');
		if (task) {
			req.taskData = task;
			return next();
		} else {
			status = 404;
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

/**
 * Ask if the task belongs to the current logged user
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askTaskOwnership = async (req, res, next) => {
	let jsonResponse, status, task;
	const { decodedToken, taskData } = req;
	jsonResponse = {
		details: {},
		msg: 'Permission denied. You do not own this task',
		task: {},
	};
	try {
		if (taskData.project.owner.toString() !== decodedToken.id.toString()) {
			delete req.taskData;
			status = 401;
		} else {
			req.taskData = taskData;
			return next();
		}
	} catch (error) {
		status = status || 500;
		jsonResponse.msg = error.message || 'Something wrong happened';
		jsonResponse.details = {
			...jsonResponse.details,
			error,
		};
	}
	return res.status(status).json(jsonResponse);
};

export {
	getTasks,
	getTask,
	updateTask,
	deleteTask,
	createTask,
	updateTaskStatus,
	askProjectExistById,
	askProjectOwnership,
	getTasksByProjectId,
	askTaskExistById,
	askTaskOwnership,
};
