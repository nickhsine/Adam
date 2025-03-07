import styled from 'styled-components'
import Link from 'next/link'
import { Frequency } from '../../../constants/membership'
import { useMembership } from '../../../context/membership'
const inviteMemberOptionColor = {
  premium: {
    description: '#61B8C6', //light blue of theme color
    link: '#61B8C6',
  },
  oneTime: {
    description: '#EBEBEB',
    link: '#000000',
  },
}

const InviteMemberCardWrapper = styled.div`
  width: 100%;
  height: auto;
  border-radius: 10px;
  filter: drop-shadow(4px 4px 10px rgba(0, 0, 0, 0.25));
  padding: 20px 20px;
  background-color: ${({ theme }) => theme.color.brandColor.darkBlue};
  text-align: center;
  h3 {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    margin: 0 auto 32px;
    min-width: 173px;
    font-size: 24px;
    line-height: 1.5;
    color: #fff;
    gap: 0 8px;
    font-weight: 600;
  }
  .already-member {
    margin: 0 auto;
    font-size: 16px;
    line-height: 2;
    min-height: 32px;

    color: rgba(238, 238, 238, 1);
    .login {
      text-decoration: underline;
    }
  }
  ${({ theme }) => theme.breakpoint.md} {
    padding: 20px 72px;
  }
`
const OptionWrapper = styled.div`
  ${({ theme }) => theme.breakpoint.md} {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
`
const InviteMemberOption = styled.div`
  height: fit-content;
  margin-bottom: 32px;
  .description {
    text-align: center;
    color: ${
      /**
       * @param {{optionType: 'premium' | 'oneTime'}} param0
       */
      ({ optionType }) => inviteMemberOptionColor[optionType].description
    };
    margin: 0 auto 17px;
  }
  .link {
    text-align: center;
    display: block;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    border-radius: 24px;
    padding: 19px 12px;
    margin: 0 auto;
    width: ${({ optionType }) =>
      optionType === 'premium' ? '200px' : '184px'};
    font-weight: 500;
    font-size: 20px;
    line-height: 1.5;
    background-color: ${({ optionType }) =>
      inviteMemberOptionColor[optionType].link};
    color: white;
  }
`
const InviteMemberCard = ({ postId = '' }) => {
  const { isLoggedIn } = useMembership()
  return (
    <InviteMemberCardWrapper>
      <h3>
        <span>歡迎加入鏡週刊</span> <span> 會員專區</span>
      </h3>
      <OptionWrapper>
        <InviteMemberOption optionType="premium">
          <p className="description">
            限時優惠每月$49元 <br></br>全站看到飽
          </p>

          <Link href="/subscribe" className="link">
            加入premium會員
          </Link>
        </InviteMemberOption>
        <InviteMemberOption optionType="oneTime">
          <p className="description">
            ＄5元可享單篇好文14天 <br></br>無限瀏覽
          </p>

          <Link
            href={
              postId
                ? `/subscribe/info?plan=${Frequency.OneTimeHyphen}&one-time-post-id=${postId}`
                : '/subscribe'
            }
            className="link"
          >
            解鎖單篇報導
          </Link>
        </InviteMemberOption>
      </OptionWrapper>
      <p className="already-member">
        {isLoggedIn ? null : (
          <>
            已經是會員？
            <Link href="/login" className="login">
              立即登入
            </Link>
          </>
        )}
      </p>
    </InviteMemberCardWrapper>
  )
}
const Wrapper = styled.div`
  width: 100%;

  margin: 0 auto;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    width: 100%;
    height: 300px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, white 80%);
  }
`

export default function ArticleMask({ postId = '' }) {
  return (
    <Wrapper>
      <InviteMemberCard postId={postId}></InviteMemberCard>
    </Wrapper>
  )
}
