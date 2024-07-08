// import { AuthenticationCosmosService, Project, User } from '@cosmos-workspace-2023/cosmos-services';
import React from 'react';
import { UserDocument } from "../models/user"

export interface GindIAContextProps {
    currentUser: UserDocument|undefined,
    setCurrentUser: (user:UserDocument) => void
}

export const GindIAContext = React.createContext<GindIAContextProps|undefined>(undefined);

export default GindIAContext;
