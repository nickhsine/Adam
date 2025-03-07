//TODO: replace <a> with <Link> from Nextjs for Single Page Application

import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {
  SUB_BRAND_LINKS,
  PROMOTION_LINKS,
  SOCIAL_MEDIA_LINKS,
} from '../constants'

const DISPLAY_PARTNERS = [{ name: '生活暖流', href: '/externals/warmlife' }]

import SubBrandList from './sub-brand-list'
import SearchBarDesktop from './search-bar-desktop'
import PromotionLinks from './promotion-links'
import NavSections from './nav-sections'
import GptAd from './gpt-ad.js'
import MemberLoginButton from './member-login-button'
import SearchBarInput from './search-bar-input'
import MobileSidebar from './mobile-sidebar'
import Logo from './logo'
import SubscribeMagazine from './subscribe-magazine'
import NavTopics from './nav-topics'
import { SEARCH_URL } from '../config/index.mjs'

/**
 *
 *  @typedef {import('../apollo/fragments/section').Section[]} Sections
 */
/**
 * @typedef {import('./nav-sections').SectionWithHrefTemp} SectionWithHrefTemp
 */

/**
 * @typedef {import('./nav-topics').Topics} Topics
 */

const HeaderWrapper = styled.div`
  background-color: rgba(255, 255, 255, 1);
  margin: 0 auto;
`
const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 21px 8px 20px;
  max-width: 596px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoint.md} {
    padding: 21px 8px 20px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    border-bottom: 3px solid black;
    padding: 21px 90px 20px;
    max-width: 1200px;
  }
`
const HeaderBottom = styled.div`
  max-width: 596px;
  margin: 0 auto;
  ${({ theme }) => theme.breakpoint.xl} {
    max-width: 1024px;
  }
`
const HeaderLogo = styled(Logo)`
  display: none;
  ${({ theme }) => theme.breakpoint.md} {
    display: block;
    width: 49px;
    height: 20.72px;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: block;
    width: 107px;
    height: 45px;
  }
`

const ActionWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  z-index: 529;
`
const SearchButtonMobile = styled.button`
  display: block;
  &:focus {
    border: none;
    outline: none;
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }
`
const SearchInputMobile = styled(SearchBarInput)`
  width: 100%;
  border: unset;
  margin: auto 15px;
  input {
    background-color: white;
    &::placeholder {
      color: rgba(188, 188, 188, 1);
    }
  }
`

const SearchInputWrapper = styled.div`
  background-color: #f5f5f5;
  display: flex;
  align-content: center;
  text-align: center;
  ${
    /**
     * @param {{showSearchField:boolean}} props
     */ ({ showSearchField }) =>
      showSearchField ? 'height: 60px;' : 'height: 0px;'
  }
  ${({ theme }) => theme.breakpoint.xl} {
    display: none;
  }

  transition: height 0.5s ease-out;
  ${SearchInputMobile} {
    ${
      /**
       * @param {{showSearchField:boolean}} props
       */ ({ showSearchField }) =>
        showSearchField ? 'display:block' : 'display:none'
    }
  }
`

const TopicsAndFlashNews = styled.section`
  margin-top: 10px;
`
const TopicsAndSubscribe = styled.section`
  display: flex;
`

/**
 * Remove item from array `categories` if which is member only category.
 * @param {import('../apollo/fragments/section').Section} section
 * @returns {import('../apollo/fragments/section').Section}
 */
function filterOutIsMemberOnlyCategoriesInNormalSection(section) {
  return {
    ...section,
    categories:
      section.slug === 'member'
        ? section.categories
        : section.categories.filter((category) => !category.isMemberOnly),
  }
}

/**
 * Remove item from array `categories` if which is member only category.
 * @param {import('../apollo/fragments/section').Section} section
 * @return {SectionWithHrefTemp}
 */
function getSectionAndCategoryHref(section) {
  const getCategoryHref = (sectionSlug, categorySlug) => {
    if (sectionSlug === 'videohub') {
      return `/video_category/${categorySlug}`
    }
    if (categorySlug === 'magazine') {
      return '/magazine/'
    }
    return `/category/${categorySlug}`
  }

  /**
   *
   * @param {string} sectionSlug
   * @returns {string}
   */
  const getSectionHref = (sectionSlug) => {
    if (sectionSlug === 'member') {
      return `/premiumsection/${sectionSlug}`
    } else {
      return `/section/${sectionSlug}`
    }
  }
  const getCategoryWithHref = (section, categories) => {
    return categories.map((category) => {
      return { ...category, href: getCategoryHref(section.slug, category.slug) }
    })
  }
  const newSection = {
    ...section,
    href: getSectionHref(section.slug),
    categories: getCategoryWithHref(section, section.categories),
  }
  return newSection
}

/**
 * TODO: use typedef in `../apollo/fragments/section` and  `../apollo/fragments/topic`
 * Should be done after fetch header data from new json file
 * @param {Object} props
 * @param {Sections} props.sectionsData
 * @param {Topics} props.topicsData
 * @param {JSX.Element} [props.children]
 * @returns {React.ReactElement}
 */
export default function Header({
  sectionsData = [],
  topicsData = [],
  children = null,
}) {
  const [showSearchField, setShowSearchField] = useState(false)
  const [searchTerms, setSearchTerms] = useState('')
  const mobileSearchButtonRef = useRef(null)
  const mobileSearchWrapperRef = useRef(null)

  // If user click search button, will show/hide search field search input field.
  // If user click outside of search input field, or outside of search button, will hide  search field if needed.
  useEffect(() => {
    const handleSearchFieldOpen = (/** @type {MouseEvent}*/ event) => {
      if (
        mobileSearchButtonRef.current &&
        mobileSearchButtonRef.current.contains(event.target)
      ) {
        setShowSearchField((val) => !val)
      } else if (
        mobileSearchWrapperRef.current &&
        !mobileSearchWrapperRef.current.contains(event.target)
      ) {
        setShowSearchField(false)
      }
    }
    document.addEventListener('click', handleSearchFieldOpen, true)
    return () => {
      document.removeEventListener('click', handleSearchFieldOpen, true)
    }
  }, [mobileSearchButtonRef, mobileSearchWrapperRef, setShowSearchField])

  const goSearch = () => {
    /*
      1. remove whitespace from both sides of a string
      2. remove whitespace from both sides of any comma
      3. replace whitespace bwtween two letters with a comma
     */
    const trimedSearchTerms = searchTerms
      .trim()
      .replace(/\s*,\s*/g, ',')
      .replace(/\s+/g, ',')

    if (trimedSearchTerms === '') return setSearchTerms('')
    location.assign(`${SEARCH_URL}/search/v3/${trimedSearchTerms}`)
  }

  const sections =
    sectionsData
      .map(filterOutIsMemberOnlyCategoriesInNormalSection)
      .map(getSectionAndCategoryHref) ?? []
  const topics = topicsData.slice(0, 9)

  return (
    <HeaderWrapper>
      <HeaderTop>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/">
          <HeaderLogo />
        </a>
        <GptAd />
        <ActionWrapper>
          <SubBrandList subBrands={SUB_BRAND_LINKS} />
          <SearchBarDesktop
            searchTerms={searchTerms}
            setSearchTerms={setSearchTerms}
            goSearch={goSearch}
          />
          <SearchButtonMobile ref={mobileSearchButtonRef}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/search-button-mobile.svg" alt="search-button" />
          </SearchButtonMobile>
          <MemberLoginButton />
          <PromotionLinks links={PROMOTION_LINKS} />
          <MobileSidebar
            topics={topics}
            sections={sections}
            displayedPartners={DISPLAY_PARTNERS}
            subBrands={SUB_BRAND_LINKS}
            promotions={PROMOTION_LINKS}
            socialMedia={SOCIAL_MEDIA_LINKS}
          />
        </ActionWrapper>
      </HeaderTop>
      <HeaderBottom>
        <SearchInputWrapper
          showSearchField={showSearchField}
          ref={mobileSearchWrapperRef}
        >
          <SearchInputMobile
            value={searchTerms}
            onChange={
              /** @param {React.ChangeEvent<HTMLInputElement>} event */
              (event) => {
                setSearchTerms(event.target.value)
              }
            }
            onKeyPress={
              /** @param {React.KeyboardEvent} e */
              (e) => {
                if (e.key === 'Enter') {
                  goSearch()
                }
              }
            }
          />
        </SearchInputWrapper>
        <NavSections sections={sections} displayedPartners={DISPLAY_PARTNERS} />
        <TopicsAndFlashNews>
          {children}
          <TopicsAndSubscribe>
            <NavTopics topics={topics} />
            <SubscribeMagazine />
          </TopicsAndSubscribe>
        </TopicsAndFlashNews>
      </HeaderBottom>
    </HeaderWrapper>
  )
}
