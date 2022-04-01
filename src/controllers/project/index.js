import Project from '../../models/Project.js';
import Task from '../../models/Task.js';

/**
 * Get all projects
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getProjects = async (req, res, next) => {
	let jsonResponse, status, projects;
	const { authToken } = req;
	jsonResponse = {
		details: {},
		msg: 'All projects',
		projects: [],
	};
	try {
		projects = await Project.find().where("owner").equals(authToken.id);
		jsonResponse.projects = projects;
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
 * Get project
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const getProject = async (req, res, next) => {
	let jsonResponse, status;
	const { projectData } = req;
	jsonResponse = {
		details: {},
		msg: 'Project',
		project: {},
	};
	try {
		jsonResponse.project = projectData;
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
 * Create project
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const createProject = async (req, res, next) => {
	let jsonResponse, status, project, owner;
	const { body, authToken } = req;
	jsonResponse = {
		details: {},
		msg: 'Project created',
		project: {},
		owner: {},
	};
	try {
		owner = authToken.id;
		project = new Project(body);
		project.owner = owner;
		await project.save();
		jsonResponse.project = project;
		jsonResponse.owner = owner;
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
 * Update project
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const updateProject = async (req, res, next) => {
	let jsonResponse, status, project;
	const { body, projectData } = req;
	jsonResponse = {
		details: {},
		msg: 'Project updated',
		project: {},
	};
	try {
		project = await Project.findById(projectData._id);
		project.name = body.name || project.name;
		project.description = body.description || project.description;
		project.timeline = body.timeline || project.timeline;
		project.client = body.client || project.client;
		await project.save();
		jsonResponse.project = project;
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
 * Delete project
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const deleteProject = async (req, res, next) => {
	let jsonResponse, status, project;
	const { projectData } = req;
	jsonResponse = {
		details: {},
		msg: 'Project deleted',
		project: {},
	};
	try {
		await Project.deleteOne({ _id: projectData._id });
		delete req.projectData;
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
 * Add colaborator
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const addColaborator = async (req, res, next) => {
	let jsonResponse, status, projects;
	jsonResponse = {
		details: {},
		msg: 'Colaborator added',
		projects: [],
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
 * Delete colaborator
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const deleteColaborator = async (req, res, next) => {
	let jsonResponse, status, projects;
	jsonResponse = {
		details: {},
		msg: 'Colaborator deleted',
		projects: [],
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
 * Ask if the project exist by it's _id
 * 
 * @param {Object} req - request
 * @param {Object} req - response
 * @param {Function} next - go to the next middleware
*/
const askProjectExistById = async (req, res, next) => {
	let jsonResponse, status, project;
	const { params: { id } } = req;
	jsonResponse = {
		details: {},
		msg: 'Project not found',
		project: {},
	};
	try {
		project = await Project.findById(id);
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
const aksProjectOwnership = async (req, res, next) => {
	let jsonResponse, status, tasks;
	const { projectData, authToken: { id } } = req;
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
			tasks = await Task.find().where('project').equals(projectData._id);
			req.projectData = {
				project: projectData,
				tasks,
			};
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
	getProjects,
	getProject,
	createProject,
	updateProject,
	deleteProject,
	addColaborator,
	deleteColaborator,
	askProjectExistById,
	aksProjectOwnership,
};
