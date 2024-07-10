'use client'
import { GenericComponents, getListOfLLMModels, SignedContent, Welcome } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';

import Link from 'next/link';
import { useEffect, useState } from 'react';


  export default function Index() {

    const [models, setModels] = useState<string[]>([])

    useEffect(() => {
      getListOfLLMModels().then(models => {
        setModels(models)
      })
    }, [])

    return (
            <div>
            <SignedContent publicContent={<p>public content</p>}><>
              <Welcome></Welcome>
              <ul>
              {models.map((m,i) => <li key={i}>{m}</li>)}
              </ul>
              <h4>Link to <Link scroll={false} href="/linguafix-server">LinguaFix</Link></h4>
              </>
            </SignedContent>

            </div>
    )



  }

