'use client'
import { addUser, GenericComponents, getListOfLLMModels, GindIAContext, ProjectDocument, SignedContent, updateProject, Welcome } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { MenuItem, Select } from '@mui/material';


  export default function Index() {

    const [models, setModels] = useState<string[]>([])
    const [currentProject, setCurrentProject] = useState<ProjectDocument>()
    const [currentModel, setCurrentModel] = useState<string>()
    const context = useContext(GindIAContext)



    const updateCurrentModel = (e) => {
      setCurrentModel(e.target.value)

    }

    useEffect(() => {
      getListOfLLMModels().then(models => {
        setModels(models)
        if (models.length > 0) {
          setCurrentModel(models[0])
        }
      })
    }, [])

    return (
            <div>
            <SignedContent publicContent={<p>public content</p>}><>
              <Welcome></Welcome>
              {models && currentModel && (<Select value={currentModel} onChange={updateCurrentModel}>

              {models.map((m,i) => <MenuItem key={i} value={m} >{m}</MenuItem>)}
              </Select>)}
              <h4>Link to <Link scroll={false} href="/linguafix-server">LinguaFix</Link></h4>
              </>
            </SignedContent>

            </div>
    )



  }

