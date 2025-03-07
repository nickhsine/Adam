import styled from 'styled-components'

import Link from 'next/link'
const SubscribeMagazineButton = styled.button`
  display: none;
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 141px;
    background-color: rgba(0, 0, 0, 1);
    color: white;
    text-align: center;
  }
`

export default function SubscribeMagazine() {
  return (
    <SubscribeMagazineButton>
      <Link href="/papermag">鏡週刊雜誌訂閱</Link>
    </SubscribeMagazineButton>
  )
}
