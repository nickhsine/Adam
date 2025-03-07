import axios from 'axios'
import styled from 'styled-components'
import Image from 'next/legacy/image'
import Layout from '../../../components/v3-layout'
import {
  URL_STATIC_COMBO_SECTIONS,
  URL_MIRROR_MEDIA_V3,
  API_TIMEOUT,
  API_PROTOCOL,
  API_HOST,
  API_PORT,
} from '../../../config'
import { getSearchResult } from '../../../utils/api/programmable-search'
import SearchedArticles from '../../../components/searched-articles'

const SearchContainer = styled.main`
  width: 320px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    width: 672px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    width: 1024px;
    padding: 0;
  }
`

const SearchTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.breakpoint.md} {
    &::after {
      content: '';
      margin: 0px 0px 0px 28px;
      display: inline-block;
      flex: 1 1 auto;
      height: 2px;
      background: linear-gradient(90deg, rgb(0, 0, 0) 30%, rgb(255, 255, 255));
    }
  }
`

const SearchTitle = styled.h1`
  display: inline-block;
  margin: 16px 0 16px;
  padding: 4px 16px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 600;
  border-radius: 6px;
  display: flex;
  align-items: start;
  ${({ theme }) => theme.breakpoint.md} {
    margin: 20px 0 24px;
    padding: 4px 8px;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.4;
    border-radius: 10px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    margin: 24px 0 28px;
  }
`

const CommaStart = styled.span`
  display: inline-flex;
  margin-right: 6px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-right: 8px;
  }
`
const CommaEnd = styled.span`
  display: inline-flex;
  margin-left: 6px;
  ${({ theme }) => theme.breakpoint.md} {
    margin-left: 16px;
  }
`

export default function Search({ searchResult }) {
  const searchTerms = searchResult?.queries?.request[0].exactTerms ?? ''

  return (
    <SearchContainer>
      <SearchTitleWrapper>
        <SearchTitle>
          <CommaStart>
            <Image
              src="/images/double-comma-start.svg"
              alt="double comma start"
              width={8}
              height={6.6}
            ></Image>
          </CommaStart>
          {searchTerms}
          <CommaEnd>
            <Image
              src="/images/double-comma-end.svg"
              alt="double comma end"
              width={8}
              height={6.6}
            ></Image>
          </CommaEnd>
        </SearchTitle>
      </SearchTitleWrapper>
      <SearchedArticles searchResult={searchResult} />
    </SearchContainer>
  )
}

Search.getLayout = function getLayout(page, pageProps) {
  const { sectionsData = [], topicsData = [] } = pageProps

  return (
    <Layout sectionsData={sectionsData} topicsData={topicsData}>
      {page}
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const searchTerms = params.searchTerms
  console.log('URL_MIRROR_MEDIA_V3', URL_MIRROR_MEDIA_V3)
  try {
    const responses = await Promise.allSettled([
      axios({
        method: 'get',
        url: URL_STATIC_COMBO_SECTIONS,
        timeout: API_TIMEOUT,
      }),
      axios({
        method: 'get',
        url: `${API_PROTOCOL}://${API_HOST}:${API_PORT}/combo?endpoint=topics`,
        timeout: API_TIMEOUT,
      }),
      getSearchResult({
        exactTerms: searchTerms,
        start: 1,
      }),
    ])

    const props = {
      sectionsData: responses[0].value.data._items,
      topicsData: responses[1].value.data._endpoints.topics._items,
      searchResult: responses[2].value.data,
      redirectUrl: URL_MIRROR_MEDIA_V3,
    }

    console.log(
      JSON.stringify({
        severity: 'DEBUG',
        message: `Successfully fetch sections and topics from ${URL_STATIC_COMBO_SECTIONS} and ${API_PROTOCOL}://${API_HOST}:${API_PORT}/combo?endpoint=topics`,
      })
    )
    return { props }
  } catch (error) {
    console.log(JSON.stringify({ severity: 'ERROR', message: error.stack }))
    return {
      props: {
        sectionsData: [],
        topicsData: [],
        searchResult: {},
        redirectUrl: URL_MIRROR_MEDIA_V3,
      },
    }
  }
}
