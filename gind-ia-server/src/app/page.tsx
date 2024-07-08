'use client'
import { GenericComponents, SignedContent, Welcome } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';

import Link from 'next/link';


  export default function Index() {



    return (
            <div>
            <SignedContent publicContent={<p>public content</p>}><>
              <Welcome></Welcome>
              <h4>Link to <Link scroll={false} href="/linguafix-server">linguifix</Link></h4>
              </>
            </SignedContent>

            </div>
    )



  }

