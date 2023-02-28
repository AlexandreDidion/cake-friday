import { useState } from 'react'
import styles from '@/styles/BurgerMenu.module.scss'
import { useRouter } from 'next/router'

import Box from '@mui/material/Box'
import { Loader } from '@/components/Loader'
import Image from 'next/image'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { auth } from '@/initFirebase'
import { logOut } from '@/services/firebaseAuth'

const OPTIONS_NOT_CONNECTED = Object.freeze([
  {label: 'Log In', name: 'logIn'},
  {label: 'Sign Up', name: 'signUp'},
])

const OPTIONS_CONNECTED = Object.freeze([
  {label: 'My Team', name: 'myTeam'},
  {label: 'Add Team Member', name: 'newMember'},
  {label: 'Log Out', name: 'logOut'},
])

export const BurgerMenu = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isConnected = !!auth.currentUser

  const options = isConnected ? OPTIONS_CONNECTED : OPTIONS_NOT_CONNECTED

  const redirectwithQuery = (action: string) => router.push({ pathname: '/auth', query: {action: action} })

  const onLogOut = async () => {
    setIsLoading(true)
    await logOut()
    setIsLoading(false)
  }

  const actions : {[key: string]: Function} = {
    logIn: () => redirectwithQuery('logIn'),
    signUp: () => redirectwithQuery('signUp'),
    myTeam: () => router.push('/team/mine'),
    newMember: () => router.push('/team/new'),
    logOut: onLogOut,
  }

  const open = !!anchorEl

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    if (!e.currentTarget) return

    const idElement = e.currentTarget?.id
    if (idElement && Object.keys(actions).includes(idElement)) actions[e.currentTarget.id]()
    setAnchorEl(null)
  }

  return (
    <div>
      {isLoading && (<Loader />)}
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Image
          src="/muffin.png"
          alt="open menu icon"
          width={62}
          height={62}
        />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem id={option.name} key={option.name} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </div>

  )
}
