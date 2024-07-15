'use server'
import Project, { ProjectDocument } from "../models/project";
import  User, { UserDocument }  from "../models/user"
import mongoose from "mongoose";
import { connectDB } from "./connection-service";



export async function getProject(name:string): Promise<ProjectDocument> {
  'use server'
  const connection = await connectDB();
  let project;
  if (connection) {
    project = await Project.findOne<ProjectDocument>({name});
    project = JSON.parse(JSON.stringify(project))
    // connection.close()
  }
  return project;
}

export async function updateProject(project:ProjectDocument) {
  'use server'
  console.log("update project ", project.name)
  const connection = await connectDB();
  if (connection) {

    const foundProject = await Project.findOneAndUpdate<ProjectDocument>({name: project.name},
                 {currentLLMModel: project.currentLLMModel, currentChannel:project.currentChannel},
                {new:true}
    );
    console.log("update", foundProject)
    return JSON.parse(JSON.stringify(foundProject));

  }
  return undefined

}


export async function getProjectsByOwner(owner:string): Promise<ProjectDocument[]> {
  'use server'
  const connection = await connectDB();
  let projects;
  if (connection) {
    projects = await Project.find<ProjectDocument>({owner});
    projects = JSON.parse(JSON.stringify(projects))
    // connection.close()
  }
  return projects;
}

export async function addProject(newProject:ProjectDocument) {
  'use server'
  const connection = await connectDB();
  if (connection) {
    console.log("add project", newProject)
    const foundProject = await getProject(newProject.name)
    if (!foundProject) {
      const added = await Project.insertMany([newProject])
      console.log(added)
    }
    // connection.close()
  }
}


export async function deleteProject(name:string) {
  'use server'
  const connection = await connectDB();
  if (connection) {
    const foundProject = await getProject(name)
    console.log("deleting one project", name, foundProject)
    if (foundProject) {

      const added = await Project.deleteOne({name})
      console.log(added)
    }
    // connection.close()
  }
}


