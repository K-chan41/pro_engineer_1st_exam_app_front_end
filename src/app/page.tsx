import { Button } from '@mantine/core';
import classes from './active.module.css';
import { HeaderMenu } from './components/HeaderMenu'

export default function Home() {
  return (
    <>
      <HeaderMenu />
      <Button>Press me to see active styles</Button>
    </>
  )
}