import  mongoose, { Schema, model } from  "mongoose";


export interface Message {
  type: "ai"|"human"
  content:string
}

export interface Channel {
  name:string;
  messages: Message[];
}

export interface ProjectDocument {

  name: string;
  owner: string;
  channels: Channel[];
  currentChannel?: string;
  currentLLMModel?:string;
}

const ChannelSchema = new Schema<Channel>({
  name: {
    type: String,
    required: [true, "name of channel is required"]
  }
})

const ProjectSchema = new Schema<ProjectDocument>({

  name: {
    type: String,
    required: [true, "Name is required"]
  },
  owner: {
    type: String,
    required: [true, "Owner is required"]
  },
  channels: {
    type: [ChannelSchema]
  },

  currentChannel: {
    type: String,
  },
  currentLLMModel: {
    type: String
  }

},
{
  timestamps: true,
}
);



const  Project  =  mongoose.models?.Project  ||  model<ProjectDocument>('Project', ProjectSchema);
export  default  Project;
