import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";

interface SearchTagProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onClearTags: () => void;
  onSearch: () => void;
}

// 태그 카테고리 정의
const tagCategories = {
  장르: [
    "판타지",
    "SF",
    "미스터리",
    "스릴러",
    "공포",
    "로맨스",
    "역사소설",
    "모험",
    "코미디",
    "블랙 코미디",
    "드라마",
    "범죄",
    "서스펜스",
  ],
  분위기: [
    "감동적인",
    "잔잔한",
    "긴장감 있는",
    "우울한",
    "유머러스한",
    "어두운",
    "밝고 긍정적",
    "철학적",
    "역동적인",
    "몽환적인",
    "역설적인",
    "잔혹한",
    "황홀한",
    "불안감을 조성하는",
    "낭만적인",
    "냉소적인",
    "초현실적인",
  ],
  주제: [
    "사회 비판적",
    "불평등",
    "젠더 문제",
    "전쟁과 평화",
    "운명과 자유의지",
    "도덕적 딜레마",
    "혁명과 저항",
    "환경과 생태",
    "의료 및 바이오테크",
    "외교와 정치 음모",
    "권력과 부패",
    "노동과 계급투쟁",
    "이민과 정체성",
    "문화 충돌",
    "무정부주의",
    "전통과 혁신",
    "인공지능과 정보화",
    "가족 드라마",
    "스포츠",
  ],
  테마: [
    "성장 이야기",
    "트라우마와 치유",
    "우정과 동료애",
    "종교적·영적 요소",
    "복수와 정의",
    "정체성 탐색",
    "내면 탐구",
    "기억과 시간",
    "이중성",
    "금기와 반항",
    "실존적 고민",
    "욕망과 타락",
    "재난·서바이벌",
    "저널리즘",
  ],
  스페셜: [
    "의식의 흐름",
    "미완의 이야기",
    "실험적 문체",
    "형식 파괴적",
    "독특한 서술 방식",
    "대체 역사",
    "비선형 서사",
    "스토리텔링",
  ],
  세계관: [
    "디스토피아",
    "유토피아",
    "포스트 아포칼립스",
    "사이버펑크",
    "다중 우주",
    "시간 여행",
    "초현실적 공간",
    "미지의 영역 탐험",
    "이세계",
    "신화적 세계",
    "가상 현실",
    "기후 변화 세계",
  ],
};

// 스크롤 관련 로직을 위한 Hook
const useTagScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const SCROLL_AMOUNT = 150;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!listRef.current || !containerRef.current) return;

    const { scrollWidth, clientWidth } = listRef.current;
    const maxScroll = scrollWidth - clientWidth;

    let newPosition;
    if (direction === 'left') {
      newPosition = Math.max(0, scrollPosition - SCROLL_AMOUNT);
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + SCROLL_AMOUNT);
    }

    setScrollPosition(newPosition);
    if (listRef.current) {
        listRef.current.style.transform = `translateX(-${newPosition}px)`;
    }
  };

  // 스크롤 가능 여부 상태 추가
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 리스트 너비 변경 또는 스크롤 위치 변경 시 스크롤 가능 여부 재계산
  useEffect(() => {
    const checkScroll = () => {
        if (listRef.current && containerRef.current) {
            const { scrollWidth, clientWidth } = listRef.current;
            const maxScroll = scrollWidth - clientWidth;

            // 스크롤 위치 보정 (화면 크기 변경 등으로 스크롤 위치가 범위를 벗어날 경우)
            if (scrollPosition > maxScroll) {
                const newScrollPosition = Math.max(0, maxScroll);
                setScrollPosition(newScrollPosition);
                if (listRef.current) {
                  listRef.current.style.transform = `translateX(-${newScrollPosition}px)`;
                }
                // 보정된 위치 기준으로 스크롤 가능 여부 즉시 업데이트
                setCanScrollLeft(newScrollPosition > 0);
                setCanScrollRight(newScrollPosition < maxScroll - 1);
            } else {
                // 일반적인 경우 스크롤 가능 여부 업데이트
                setCanScrollLeft(scrollPosition > 0);
                setCanScrollRight(scrollPosition < maxScroll - 1);
            }
        }
    };
    
    // ResizeObserver 설정
    const resizeObserver = new ResizeObserver(() => {
      // ResizeObserver 콜백에서도 스크롤 체크 실행
      // requestAnimationFrame으로 브라우저 렌더링 사이클에 맞춤
      requestAnimationFrame(checkScroll);
    });

    if (listRef.current) {
        resizeObserver.observe(listRef.current);
    }
    if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
    }

    // 컴포넌트 마운트 후 잠시 뒤에 스크롤 체크 실행 (초기 렌더링 후 크기 계산 시간 확보)
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(checkScroll); 
    }, 50); 

    // 현재 스크롤 위치가 변경될 때마다 스크롤 가능 여부 재계산
    checkScroll();

    return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
    };
  // scrollPosition 외에 listRef, containerRef의 변경도 감지 (초기 마운트 시 ref 할당 감지)
  }, [scrollPosition, listRef, containerRef]); 

  return {
    scrollPosition,
    listRef,
    containerRef,
    handleScroll,
    canScrollLeft, // 상태 변수 반환
    canScrollRight, // 상태 변수 반환
  };
};

// 각 태그 카테고리별 스크롤을 위한 컴포넌트
const ScrollableTagList: React.FC<{ tags: string[]; selectedTags: string[]; onTagSelect: (tag: string) => void }> = 
({ tags, selectedTags, onTagSelect }) => {
  const { listRef, containerRef, handleScroll, canScrollLeft, canScrollRight } = useTagScroll();

  return (
    <TagListContainer ref={containerRef}>
      {canScrollLeft && (
        <NavigationButton direction="left" onClick={() => handleScroll('left')} />
      )}
      <TagList ref={listRef}>
        {tags.map((tag) => (
          <TagButton
            key={tag}
            selected={selectedTags.includes(tag)}
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </TagButton>
        ))}
      </TagList>
      {canScrollRight && (
        <NavigationButton direction="right" onClick={() => handleScroll('right')} />
      )}
    </TagListContainer>
  );
};

const SearchTag: React.FC<SearchTagProps> = ({
  selectedTags,
  onTagSelect,
  onClearTags,
  onSearch,
}) => {

  const handleClearTags = () => {
    console.log("Clearing all tags");
    onClearTags();
    onSearch();
  };

  return (
    <TagSection>
      {Object.entries(tagCategories).map(([category, tags]) => (
        <TagCategory key={category}>
          <CategoryTitle>{category}</CategoryTitle>
          <ScrollableTagList 
            tags={tags} 
            selectedTags={selectedTags} 
            onTagSelect={onTagSelect} 
          />
        </TagCategory>
      ))}
      {selectedTags.length > 0 && (
        <SelectedTagsContainer>
          {selectedTags.map((tag) => (
            <SelectedTag key={tag} onClick={() => onTagSelect(tag)}>
              {tag} ×
            </SelectedTag>
          ))}
          <ClearTagsButton onClick={handleClearTags}>전체 해제</ClearTagsButton>
        </SelectedTagsContainer>
      )}
    </TagSection>
  );
};

const TagSection = styled.div`
  margin: 20px 0;
  background-color: white;
`;

const TagCategory = styled.div`
  margin-bottom: 10px;
`;

const CategoryTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px; 
  color: #333; 
  font-weight: bold;
`;

const TagListContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden; 
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: nowrap; 
  gap: 8px;
  padding: 5px 0; 
  transition: transform 0.3s ease;
  transform: translateX(0); 
`;

const TagButton = styled.button<{ selected: boolean }>`
  padding: 8px 16px; 
  border-radius: 20px; 
  border: 1px solid ${(props) => (props.selected ? "#00c473" : "#ddd")};
  background-color: ${(props) => (props.selected ? "#e6fff4" : "white")};
  color: ${(props) => (props.selected ? "#00c473" : "#555")};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap; 
  flex-shrink: 0; 
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.selected ? "#d9ffee" : "#f8f8f8")};
    border-color: ${(props) => (props.selected ? "#00c473" : "#bbb")};
    color: ${(props) => (props.selected ? "#00c473" : "#333")};
  }
`;

const NavigationButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 0px;' : 'right: 0px;'}
  width: 30px;
  height: 40px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s ease-in-out;
  

  &:hover {
    background-color: #f8f8f8;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
    background-color: #eee;
  }

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-top: 2px solid #555;
    border-right: 2px solid #555;
    transform: ${props => props.direction === 'left' ? 'rotate(-135deg) translateX(1px)' : 'rotate(45deg) translateX(-1px)'};
    transition: border-color 0.2s ease;
  }

  &:hover::before {
    border-color: #000;
  }
`;

const SelectedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

const SelectedTag = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  background-color: #00c473;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
`;

const ClearTagsButton = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  margin-left: auto; 

  &:hover {
    background-color: #f8f8f8;
  }
`;

export default SearchTag;
