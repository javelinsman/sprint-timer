# CiteWiz: A Tool for the Visualization of Scientific Citation Networks - 구조화된 요약

## 개요 (Overview)

### 문제 제기 (Problem Statement)
과학 문헌의 폭발적인 증가로 인해 연구자들이 관련 논문을 찾고 연구 분야의 구조를 파악하는 것이 점점 더 어려워지고 있다. 기존의 검색 도구들은 키워드 기반 검색에 의존하여 논문 간의 관계나 연구 분야의 전체적인 구조를 파악하기 어렵다.

### 접근 방식 (Approach)
CiteWiz는 과학 인용 네트워크의 시각화를 통해 연구자들이 관련 논문을 찾고, 연구 분야의 구조를 이해하며, 중요한 논문과 저자를 식별할 수 있도록 돕는 도구이다. 3D 그래프 레이아웃, 다양한 필터링 옵션, 그리고 상호작용적인 탐색 기능을 제공한다.

### 기여 (Contributions)
- 대규모 인용 네트워크를 효과적으로 시각화하는 3D 레이아웃 알고리즘
- 다양한 관점에서 네트워크를 분석할 수 있는 필터링 메커니즘
- 연구자들의 문헌 탐색 작업을 지원하는 상호작용 기법

## 시스템 기능 (System Features)

### 시각화 디자인 (Visualization Design)

#### 3D Citation Network Visualization
- **노드**: 논문을 나타내며, 크기는 인용 횟수에 비례
- **엣지**: 인용 관계를 나타내는 방향성 있는 화살표
- **색상 인코딩**: 
  - 시간에 따른 색상 그라데이션 (오래된 논문은 파란색, 최신 논문은 빨간색)
  - 저자별 색상 구분 옵션
  - 키워드 매칭에 따른 하이라이팅

#### Layout Algorithm
- 3D force-directed layout 사용
- 인용 관계가 많은 논문들끼리 가까이 배치
- 시간 순서를 고려한 레이어링 옵션

#### Visual Filtering
- **시간 필터**: 특정 기간의 논문만 표시
- **인용 수 필터**: 최소 인용 횟수 이상의 논문만 표시
- **저자 필터**: 특정 저자의 논문만 하이라이팅
- **키워드 필터**: 특정 키워드를 포함한 논문 강조

### 문헌 리뷰 지원 측면 (Literature Review Support)

#### 1. Finding Seminal Papers (중요 논문 찾기)
- 노드 크기를 통해 높은 인용수를 가진 영향력 있는 논문을 즉시 식별
- 네트워크 중심부에 위치한 핵심 논문들을 시각적으로 파악

#### 2. Understanding Research Evolution (연구 발전 과정 이해)
- 시간에 따른 색상 그라데이션으로 연구 분야의 역사적 발전 추적
- 인용 화살표를 따라가며 아이디어의 흐름 파악

#### 3. Identifying Research Communities (연구 커뮤니티 식별)
- 밀집된 클러스터를 통해 관련 연구 그룹 발견
- 저자별 색상 구분으로 특정 연구자의 영향력 범위 파악

#### 4. Discovering Related Work (관련 연구 발견)
- 특정 논문에서 시작하여 인용 관계를 따라가며 관련 논문 탐색
- 공통 참조 논문을 통해 유사한 주제의 연구 발견

### 상호작용 기능 (Interactive Features)

- **3D Navigation**: 마우스를 이용한 회전, 확대/축소, 이동
- **Focus+Context**: 선택한 논문 주변만 상세히 표시하고 나머지는 간략히 표시
- **Details on Demand**: 논문 위에 마우스를 올리면 상세 정보 표시
- **Path Highlighting**: 두 논문 간의 인용 경로 하이라이팅

## BibTeX Entry

```bibtex
[BibTeX entry not provided - please provide if available]
```