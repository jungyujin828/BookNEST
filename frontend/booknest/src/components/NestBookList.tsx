import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FaStar, FaStarHalfAlt, FaTrash } from "react-icons/fa";

interface NestBook {
  bookId: number;
  title: string;
  authors: string;
  imageUrl: string;
  createdAt: string;
  userRating: number;
  userReview: string;
}

interface PaginationInfo {
  pageNumber: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  first: boolean;
  last: boolean;
}

interface UserInfo {
  userId: number;
  nestId: number;
  nickname: string;
  archetype: string;
  gender: string;
  birthDate: string;
  roadAddress: string;
  zipcode: string;
  profileURL: string;
  followers: number;
  followings: number;
  totalRatings: number;
  totalReviews: number;
}

interface NestBookListProps {
  userId?: number;
  nestId?: number;
}

const Container = styled.div`
  width: 100%;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
`;

const BookCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  background-color: white;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }

  &:hover .delete-button {
    opacity: 1;
  }
`;

const BookCover = styled.div`
  position: relative;
  height: 260px;

  @media (max-width: 768px) {
    height: 220px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BookInfo = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const BookTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
`;

const BookAuthor = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const StarContainer = styled.div`
  display: flex;
  color: #f8d254;
  margin-right: 8px;
`;

const RatingValue = styled.span`
  font-size: 14px;
  color: #444;
`;

const ReviewText = styled.p`
  margin: 8px 0 0 0;
  font-size: 14px;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  background-color: ${(props) => (props.isActive ? "#00c473" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#333")};
  border: 1px solid #ddd;
  padding: 8px 12px;
  margin: 0 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#00b368" : "#f5f5f5")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 48px;
  color: #e53935;
  background-color: #ffebee;
  border-radius: 8px;
`;

const LoginRequiredState = styled.div`
  text-align: center;
  padding: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #eaeaea;
`;

const LoginButton = styled.button`
  background-color: #00c473;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #00b368;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(220, 53, 69, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &:hover {
    background-color: rgb(220, 53, 69);
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`;

const renderRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" />);
  }

  return stars;
};

const NestBookList = forwardRef<{ fetchNestBooks: () => void }, NestBookListProps>(
  ({ userId: propUserId, nestId: propNestId }, ref) => {
    const [books, setBooks] = useState<NestBook[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
      pageNumber: 1,
      totalPages: 1,
      totalElements: 0,
      pageSize: 10,
      first: true,
      last: true,
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAuthError, setIsAuthError] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    const navigate = useNavigate();

    // 사용자 정보 조회
    const fetchUserInfo = async () => {
      try {
        console.log("사용자 정보 조회 시작");
        const response = await api.get("/api/user/info");
        console.log("사용자 정보 응답:", response.data);

        if (response.data.success && response.data.data) {
          setUserInfo(response.data.data);
          return response.data.data;
        }
        return null;
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
        return null;
      }
    };

    const fetchNestBooks = async (page = 1, currentUserId?: number, currentNestId?: number) => {
      try {
        setLoading(true);
        setError(null);
        setIsAuthError(false);

        // 우선순위: props로 전달된 값 > 사용자 정보에서 가져온 값
        const effectiveUserId = propUserId || currentUserId;
        const effectiveNestId = propNestId || currentNestId;

        // API 스펙에 맞게 Query Parameter 수정
        const params: Record<string, any> = {
          page: page,
          size: 10,
        };

        // userId와 nestId 값이 있는 경우만 파라미터에 추가
        if (effectiveUserId !== undefined && effectiveUserId !== null) {
          params.userId = effectiveUserId;
        }

        if (effectiveNestId !== undefined && effectiveNestId !== null) {
          params.nestId = effectiveNestId;
        }

        // 디버깅 정보 출력
        console.log("API 요청 파라미터:", params);
        console.log("토큰:", localStorage.getItem("token"));

        // axios 인터셉터가 토큰을 자동으로 추가하므로 명시적 헤더 설정 제거
        const response = await api.get("/api/nest", { params });

        console.log("API 응답:", response.data);

        if (response.data.success) {
          if (response.data.data && response.data.data.content) {
            setBooks(response.data.data.content);
            setPagination({
              pageNumber: response.data.data.pageNumber,
              totalPages: response.data.data.totalPages,
              totalElements: response.data.data.totalElements,
              pageSize: response.data.data.pageSize,
              first: response.data.data.first,
              last: response.data.data.last,
            });
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // 다른 형태의 응답인 경우 처리 (배열로 직접 오는 경우)
            setBooks(response.data.data);
            setPagination({
              pageNumber: 1,
              totalPages: 1,
              totalElements: response.data.data.length,
              pageSize: response.data.data.length,
              first: true,
              last: true,
            });
          } else {
            // 데이터가 없는 경우
            setBooks([]);
            setPagination({
              pageNumber: 1,
              totalPages: 1,
              totalElements: 0,
              pageSize: 10,
              first: true,
              last: true,
            });
          }
        } else {
          throw new Error(response.data.error?.message || "데이터를 불러오는데 실패했습니다.");
        }
      } catch (err: any) {
        console.error("Failed to fetch nest books:", err);
        console.error("Error details:", err.response?.data || err.message);
        console.error("Error status:", err.response?.status);

        // 403 에러 (인증 관련) 처리
        if (err.response && (err.response.status === 403 || err.response.status === 401)) {
          setIsAuthError(true);
          setError("로그인이 필요한 서비스입니다.");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("둥지 도서 목록을 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    // 컴포넌트 마운트 시 사용자 정보를 먼저 조회하고, 그 후 도서 목록 조회
    useEffect(() => {
      const initializeData = async () => {
        // props로 userId나 nestId가 전달되지 않은 경우 사용자 정보 조회
        if (!propUserId && !propNestId) {
          const userInfoData = await fetchUserInfo();
          if (userInfoData) {
            // 조회한 사용자 정보로 도서 목록 요청
            await fetchNestBooks(currentPage, userInfoData.userId, userInfoData.nestId);
          } else {
            // 사용자 정보 조회 실패 시 그냥 페이지네이션으로만 요청
            await fetchNestBooks(currentPage);
          }
        } else {
          // props로 전달된 값이 있는 경우 그대로 사용
          await fetchNestBooks(currentPage, propUserId, propNestId);
        }
      };

      initializeData();
    }, [currentPage, propUserId, propNestId]);

    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
    };

    const handleLoginClick = () => {
      // 현재 URL을 저장하고 로그인 페이지로 리다이렉트
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
    };

    const handleDeleteBook = async (bookId: number, event: React.MouseEvent) => {
      // 이벤트 버블링 방지 (Link 컴포넌트의 클릭 이벤트가 발생하지 않도록)
      event.preventDefault();
      event.stopPropagation();

      if (!window.confirm("정말로 이 책을 둥지에서 삭제하시겠습니까?")) {
        return;
      }

      try {
        setLoading(true);

        // 현재 사용자 정보 또는 prop으로 전달된 정보로 요청
        const effectiveNestId = propNestId || userInfo?.nestId;

        // API 요청 바디 구성
        const requestBody = {
          nestId: effectiveNestId,
          bookId: bookId,
        };

        // DELETE 요청 보내기 (데이터를 바디에 포함)
        const response = await api.delete("/api/nest", {
          data: requestBody,
        });

        if (response.data.success) {
          // 삭제 성공 후 도서 목록에서 해당 도서 제거
          const updatedBooks = books.filter((book) => book.bookId !== bookId);
          setBooks(updatedBooks);

          // 화면에 표시할 도서가 없어진 경우 목록 다시 불러오기
          if (updatedBooks.length === 0 && pagination.pageNumber > 1) {
            setCurrentPage(pagination.pageNumber - 1);
          } else if (updatedBooks.length === 0) {
            // 첫 페이지에서 마지막 항목이 삭제된 경우
            fetchNestBooks(currentPage, propUserId, effectiveNestId);
          }
        } else {
          throw new Error(response.data.error?.message || "도서 삭제에 실패했습니다.");
        }
      } catch (err: any) {
        console.error("Failed to delete book from nest:", err);
        console.error("Error details:", err.response?.data || err.message);

        // 오류 메시지 표시
        alert(err.response?.data?.error?.message || "도서 삭제에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    // 페이지네이션 버튼 생성
    const renderPagination = () => {
      const pageButtons = [];
      const maxVisibleButtons = 5;

      let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
      let endPage = Math.min(pagination.totalPages, startPage + maxVisibleButtons - 1);

      // 표시되는 페이지 버튼 수 조정
      if (endPage - startPage + 1 < maxVisibleButtons && startPage > 1) {
        startPage = Math.max(1, endPage - maxVisibleButtons + 1);
      }

      // 이전 페이지 버튼
      pageButtons.push(
        <PageButton key="prev" onClick={() => handlePageChange(currentPage - 1)} disabled={pagination.first}>
          이전
        </PageButton>
      );

      // 페이지 번호 버튼
      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <PageButton key={i} isActive={i === currentPage} onClick={() => handlePageChange(i)}>
            {i}
          </PageButton>
        );
      }

      // 다음 페이지 버튼
      pageButtons.push(
        <PageButton key="next" onClick={() => handlePageChange(currentPage + 1)} disabled={pagination.last}>
          다음
        </PageButton>
      );

      return pageButtons;
    };

    // ref를 통해 외부에서 접근할 수 있는 메서드 정의
    useImperativeHandle(ref, () => ({
      fetchNestBooks: () => {
        if (userInfo) {
          fetchNestBooks(currentPage, userInfo.userId, userInfo.nestId);
        } else {
          fetchNestBooks(currentPage);
        }
      },
    }));

    if (loading && books.length === 0) {
      return <LoadingState>둥지 도서 목록을 불러오는 중...</LoadingState>;
    }

    if (isAuthError) {
      return (
        <LoginRequiredState>
          <div>로그인이 필요한 서비스입니다.</div>
          <LoginButton onClick={handleLoginClick}>로그인 하기</LoginButton>
        </LoginRequiredState>
      );
    }

    if (error && !isAuthError) {
      return <ErrorState>{error}</ErrorState>;
    }

    if (books.length === 0) {
      return <EmptyState>둥지에 추가한 도서가 없습니다.</EmptyState>;
    }

    return (
      <Container>
        <BookGrid>
          {books.map((book) => (
            <BookCard key={`${book.bookId}-${book.createdAt}`}>
              <DeleteButton
                onClick={(e) => handleDeleteBook(book.bookId, e)}
                title="둥지에서 삭제"
                className="delete-button"
              >
                <FaTrash size={14} />
              </DeleteButton>
              <StyledLink to={`/book-detail/${book.bookId}`}>
                <BookCover>
                  <img src={book.imageUrl} alt={book.title} />
                </BookCover>
                <BookInfo>
                  <BookTitle>{book.title}</BookTitle>
                  <BookAuthor>{book.authors}</BookAuthor>
                  <RatingContainer>
                    <StarContainer>{renderRatingStars(book.userRating)}</StarContainer>
                    <RatingValue>{book.userRating.toFixed(1)}</RatingValue>
                  </RatingContainer>
                  {book.userReview && <ReviewText>{book.userReview}</ReviewText>}
                </BookInfo>
              </StyledLink>
            </BookCard>
          ))}
        </BookGrid>

        {pagination.totalPages > 1 && <PaginationContainer>{renderPagination()}</PaginationContainer>}
      </Container>
    );
  }
);

export default NestBookList;
