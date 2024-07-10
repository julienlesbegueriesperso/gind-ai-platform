import  mongoose, { Schema, model } from  "mongoose";


export interface MessageDocument {
  type: "ai"|"human"
  content:string
}

export interface ChannelDocument {
  name:string;
  messages: MessageDocument[];
}

export interface ProjectDocument {

  name: string;
  owner: string;
  channels: ChannelDocument[];
  currentChannel?: string;
  currentLLMModel?:string;
}
const MessageSchema = new Schema<MessageDocument>({
  type: {type: String},
  content: {type: String}
})
const ChannelSchema = new Schema<ChannelDocument>({
  name: {
    type: String,
    required: [true, "name of channel is required"]
  },
  messages: {
    type: [MessageSchema]
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
const Channel = mongoose.models?.Channel || model<ChannelDocument>('Channel', ChannelSchema);
const Message = mongoose.models?.Message || model<MessageDocument>('Message', MessageSchema);
export  default  Project;
export {Channel, Message};
