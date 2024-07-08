import  mongoose, { Schema, model } from  "mongoose";


export interface ProjectDocument {

  name: string;
  owner: string;
}

const ProjectSchema = new Schema<ProjectDocument>({

  name: {
    type: String,
    required: [true, "Name is required"]
  }
},
{
  timestamps: true,
}
);


const  Project  =  mongoose.models?.Project  ||  model<ProjectDocument>('Project', ProjectSchema);
export  default  Project;
