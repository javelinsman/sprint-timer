# Visualising semantic spaces and author co-citation networks in digital libraries

## Overview
### Problem Statement
디지털 라이브러리에서 사용자들이 정보를 효과적이고 직관적으로 접근하고 탐색할 수 있도록 하는 것이 과제였다. 전통적인 도서관과 달리 디지털 라이브러리에서는 유사한 주제의 문서들을 공간적으로 가깝게 배치하는 직관적이고 의미있는 방법을 찾는 것이 어려웠다. 또한 연구 분야의 구조와 주요 연구 영역을 시각적으로 파악하기 어려웠다.

### Approach
ACM SIGCHI Conference Proceedings (1995-1997)와 ACM Hypertext Conference Proceedings (1987-1998)를 포함한 여러 문서 컬렉션에서 Latent Semantic Indexing (LSI)과 Pathfinder Network Scaling을 사용하여 의미적 구조와 인용 패턴을 추출했다. 이를 3차원 가상 세계에서 공간적 메타포를 통해 시각화하여 검색과 탐색을 동일한 의미 공간 내에서 자연스럽게 결합했다. 또한 저자 공동인용 패턴을 시각화하여 하이퍼텍스트 분야의 구조를 드러냈다.

### Contribution
문서 컬렉션의 경계를 초월하여 의미적 구조와 공동인용 네트워크의 더 깊은 패턴을 시각화하는 수단을 제공했다. 디지털 라이브러리 사용자들이 정보를 더 직관적이고 효과적으로 탐색할 수 있는 새로운 접근법을 제시했다. 하이퍼텍스트 분야의 주요 연구 영역과 시간에 따른 진화를 시각적으로 보여주는 저자 공동인용 지도를 생성했다.

## Introduction
디지털 라이브러리는 기술적 차원에서 사회적 차원까지 다양한 관점에서 주목을 받아왔다. 전통적인 도서관에서는 유사한 주제의 책들이 서로 가까이 배치되는데, 디지털 라이브러리에서도 이러한 공간적 메타포가 바람직하다. 그러나 디지털 라이브러리에서 정보를 직관적이고 의미있는 방식으로 구성하는 것은 쉽지 않은 작업이다. 정보 시각화와 자동 하이퍼텍스트 구성의 발전은 디지털 라이브러리의 정보 접근성을 개선할 기회를 제공한다.

## Related Work
Envision은 컴퓨터 과학 문헌의 선구적인 멀티미디어 디지털 라이브러리로, 전문 검색과 전체 콘텐츠 검색 기능을 갖추고 있었다. 검색 결과를 아이콘 매트릭스로 시각화할 수 있었으며, 색상과 모양을 사용하여 문서의 중요한 특성을 전달했다. LyberWorld는 추상적 정보 공간에서 공간적 탐색 메타포를 적용한 잘 알려진 예로, 네트워크 표현에 초점을 맞추었다. SPIRE는 직관적인 공간적 메타포를 기반으로 한 정보 시각화 도구 모음으로, Galaxies와 Themescape 두 가지 시각화를 지원했다. 이러한 기존 연구들은 대부분 공간적 메타포를 사용하여 정보를 시각화하려 했지만, 추상적인 디지털 문서를 구조화하는 것은 여전히 도전적인 과제였다.

## Visualising semantic spaces
이 연구에서는 두 가지 핵심 기술인 Latent Semantic Indexing (LSI)과 Pathfinder Network Scaling을 사용했다. LSI는 정보 검색에서 어휘 불일치 문제를 극복하기 위해 설계되었으며, 문서 컬렉션의 잠재적 의미 구조를 통계적 기법으로 발견할 수 있다고 가정한다. Singular Value Decomposition (SVD)을 사용하여 원본 term-document 행렬을 근사하고, 적절한 truncation을 통해 원본 데이터의 핵심 구조를 포착한다. Pathfinder network scaling은 복잡한 네트워크 표현을 더 간결하고 의미있는 네트워크로 단순화하는 구조적 모델링 기법이다. 삼각 부등식을 사용하여 중복되거나 직관에 반하는 링크를 제거한다. 문서들은 3차원 가상 세계에서 구체(sphere)로 시각화되며, 출판 연도나 출처는 구체의 색상으로 표시된다. 사용자들은 가상 구조를 확대/축소하며 탐색할 수 있고, LSI 검색 결과는 관련 문서의 위치를 표시하는 스파이크로 자연스럽게 통합된다.

## Visualising predominant research areas in hypertext
저자 공동인용 분석(Author Co-citation Analysis, ACA)을 통해 하이퍼텍스트 분야의 주요 연구 영역과 주제별 트렌드를 시각화했다. ACM Hypertext collection (1987-1998)에서 5회 이상 인용된 367명의 저자를 선정하여 분석했다. 전체 기간을 세 개의 하위 기간으로 나누어 각 기간별로 공동인용 지도를 생성했다. 요인 분석을 통해 39개의 요인을 추출했으며, 이는 전체 분산의 87.8%를 설명했다. 상위 4개 요인은 (1) classic hypertext, (2) information retrieval, (3) graphical user interfaces and information visualisation, (4) links and linking mechanisms로 확인되었다. 전체 저자 공동인용 지도에서는 Engelbart, Nelson, Halasz, Trigg, Streitz와 같은 저자들이 여러 연구 그룹을 연결하는 중요한 위치에 나타났다. 지도에서 확인된 주요 연구 영역은 Classics, Design Models, Hypertext Writing, Information Retrieval, Open Hypermedia, Information Visualisation, Structural Analysis, User Interface였다. 시기별 지도 분석을 통해 1989-1991년에는 NoteCards, Intermedia, KMS, Microcosm과 같은 클래식 하이퍼텍스트 시스템이 주도적이었고, 1992-1994년에는 SEPIA 시스템과 Open Hypermedia 연구가 부상했으며, 1996-1998년에는 예상과 달리 WWW의 영향이 크게 나타나지 않았다는 점을 발견했다.

## Discussion
이 접근법은 문서 컬렉션의 경계를 초월하여 의미적 구조와 공동인용 네트워크 측면에서 더 깊은 패턴을 시각화하는 수단을 제공한다. 공간적 메타포는 동일한 의미 공간 내에서 검색과 탐색의 자연스러운 결합을 가능하게 한다. 저자 공동인용 네트워크는 문헌을 통해 반영된 과학 분야의 스냅샷을 제공하며, 기존의 문서 컬렉션 내 용어 분포 분석에 의존하는 시각화 패러다임에 대한 가치있는 대안을 제공한다. 향후 연구로는 현실적인 디지털 라이브러리에서 이러한 시각화 패러다임의 사용성 평가와 복잡한 의미 공간 탐색에서 개인차의 역할 조사가 필요하다.

## BibTeX Entry
```bibtex
@article{chen1999visualising,
  title={Visualising semantic spaces and author co-citation networks in digital libraries},
  author={Chen, Chaomei},
  journal={Information Processing \& Management},
  volume={35},
  number={3},
  pages={401--420},
  year={1999},
  publisher={Elsevier}
}
```