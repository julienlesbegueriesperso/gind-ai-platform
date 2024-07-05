'use client'
import { GenericComponents, SignedContent } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';

import Link from 'next/link';


  export default function Index() {



    return (
            <div>
            <SignedContent publicContent={<p>public content</p>}><>
              <GenericComponents></GenericComponents>
              <h4>Link to <Link href="/linguafix-server">linguifix</Link></h4>
              </>
            </SignedContent>

            </div>
    )



  }

