# GlassViz: Visualizing Automatically-Extracted Entry Points for Exploring Scientific Corpora in Problem-Driven Visualization Research

## Overview
### Problem Statement
이 논문은 문제 중심 시각화 연구(Problem-Driven Visualization Research, PDVR) 환경에서 도메인 전문가와 시각화 전문가가 대규모 과학 문헌 코퍼스를 탐색할 때 직면하는 어려움을 다룬다. 특히 연구자들이 다른 도메인에서 개발된 시각화 기법을 자신의 도메인 문제에 적용하려고 할 때, 적절한 검색 쿼리를 구성하는 데 필요한 언어적 역량이 부족하여 관련 문헌을 찾지 못하는 문제를 해결하고자 한다.

### Approach
저자들은 두 개의 분리된 연구 논문 컬렉션(소스 도메인과 타겟 도메인)에서 발견되는 키워드 간의 분포적 유사성을 분석하여 자동으로 진입점(entry points)을 추출하는 모델을 제안한다. 이 접근법은 Swanson의 ABC 문헌 기반 발견(Literature-Based Discovery) 모델과 Miller의 방법론 전이 모델(Methodology Transfer Model)을 결합하여, 연구자가 익숙한 개념에서 시작해 잠재적으로 유용한 미지의 개념으로 점진적으로 이동할 수 있도록 돕는다.

### Contribution
이 연구의 주요 기여는 PDVR 맥락에서 과학 문헌 탐색을 향상시키는 시각적 텍스트 분석 도구인 GlassViz의 개발이다. 이 도구는 자동으로 생성된 진입점을 시각화하여 연구자가 최소한의 개입으로 개인화된 코퍼스 탐색을 수행할 수 있게 하며, 다른 도메인에서 개발된 방법론의 전이 가능성을 평가하는 데 도움을 준다.

## Introduction
문제 중심 시각화 연구는 생물학, 스포츠 과학, 컴퓨터 보안, 인문학 등 특정 학문 분야의 문제를 해결하기 위해 시각화 전문가와 도메인 전문가 간의 집중적인 협업을 요구한다. 이러한 협업은 종종 전문 워크숍, 병렬 이벤트, 마이크로 컨퍼런스(예: BioVis, Vis4DH, CityVis, VizSec)의 형태로 이루어진다. 연구자들은 다른 도메인에서 개발된 기법을 자신의 도메인 문제에 적용하는 "방법론 전이"를 수행하기 위해 대규모 시각화 출판물 데이터셋에서 문헌 검토를 수행한다. 그러나 적절한 검색어를 모르는 경우 관련 논문이 사실상 보이지 않게 되는 문제가 발생한다.

## Related Work
관련 연구는 세 가지 주요 영역으로 구성된다. 첫째, 문제 중심 시각화 연구(PDVR)에서 Simon 등은 도메인 전문가가 문제 공간을 생성하고 시각화 전문가가 디자인 공간을 정의하는 커뮤니케이션 모델을 제시했다. Miller 등은 이를 발전시켜 서로 다른 지식 도메인 간의 잠재적 방법론 전이를 식별하기 위한 유사성과 정렬 개념을 통합한 방법론 전이 모델(MTM)을 개발했다. 둘째, 문헌 기반 발견(LBD)은 Don R. Swanson이 1980년대에 도입한 지식 추출 기법으로, ABC 모델을 통해 두 개의 분리된 과학 문헌 집합 간의 비자명한 암묵적 연관성을 밝혀낸다. 셋째, 과학 문헌의 시각적 텍스트 분석 분야에서는 Action Science Explorer, PaperPoles, PaperQuest 등이 전통적인 문헌 검토의 센스메이킹 과정을 모방하는 도구들이 개발되었다.

## Data Processing
연구진은 LBD 설정에서 소스(S)와 타겟(T) 문헌으로 두 개의 연구 논문 컬렉션을 선택했다. T-문헌(VIS4DH 데이터셋)은 디지털 인문학을 위한 시각화에 관한 221편의 논문으로 구성되며, S-문헌(VIS 데이터셋)은 1991-2018년 사이 IEEE Visualization 컨퍼런스(InfoVis, SciVis, VAST, Vis)에 발표된 2,117편의 시각화 논문이다. 각 문서에서 키워드를 추출하고 토큰화했으며, Porter 알고리즘을 사용한 가벼운 스테밍을 통해 입력 어휘를 3,403개에서 2,720개 토큰으로 압축했다. 최종적으로 세 개의 분리된 집합이 생성되었다: Va(VIS4DH에만 나타나는 a-개념 259개), Vb(양쪽 데이터셋에 나타나는 b-개념 302개), Vc(VIS에만 나타나는 c-개념 2,159개).

## System Design
### Tasks and Design Goals
시스템 설계는 네 가지 주요 설계 목표를 기반으로 한다: DG.1) 사용자의 연구 목표에 맞춘 개인화된 과학 코퍼스 탐색 지원, DG.2) 다른 지식 도메인에서 소스 도메인으로 전이될 수 있는 방법론의 발견 촉진, DG.3) PDVR 맥락에서 센스메이킹과 언어 습득 가속화, DG.4) 발견된 문서에 대한 읽기 순서 제공.

### Theoretical Model
이론적 모델은 Swanson의 ABC 모델과 Miller의 방법론 전이 모델을 결합하여 서로 다른 도메인과 문헌 집합에서 문제와 디자인 공간을 매핑하는 연구자의 센스메이킹 모델을 모방하는 자동 진입점을 구축한다. 유효한 방법론 전이는 각 도메인에 특정한 개념들(a-개념과 c-개념)과 시각화 도메인의 일반적인 고수준 문제를 다루는 기법들(b-개념)로 구성된다.

### Keyword Embeddings
키워드 임베딩은 S-문헌과 T-문헌에서 문제, 데이터, 작업 또는 시각화 간의 분포적 유사성을 감지하기 위해 생성되었다. 이 방법은 최소한의 하이퍼파라미터 튜닝이 필요한 Levy 등의 방법을 따르며, 초기 점별 상호 정보(PMI) 행렬을 생성하고 SVD를 적용하여 밀집 키워드 벡터를 생성한다.

## GlassViz
### Visualization Design
GlassViz는 12개의 서로 다른 진입점을 시각화하는 주요 인터페이스를 제공한다. 각 진입점은 품질 이웃(quality neighborhoods)으로 표현되며, 이는 연결된 키워드 그룹을 보여주는 pathfinder 네트워크(PFNET)로 시각화된다. 노드는 Swanson의 ABC 모델에 따라 a-개념(빨간색), b-개념(노란색), c-개념(파란색)으로 구분되며, 노드 크기는 토큰의 절대 빈도를 인코딩한다.

### Interface Components
인터페이스는 네 가지 주요 뷰로 구성된다: (a) 진입점을 연결된 키워드 그룹으로 표현하는 품질 이웃, (b) 선택된 키워드와 일치하는 토큰 수로 정렬된 문서 목록, (c) 각 문서의 키워드 토큰, (d) 선택된 진입점의 주제 구성을 알려주는 토큰의 순위 목록. 브러싱과 링킹 상호작용 기법을 통해 사용자는 각 진입점을 탐색하고 관련 문서와 메타데이터를 검색할 수 있다.

### Coverage and Performance
진입점에 의해 포착된 용어를 포함하는 문서 수는 T-문헌에서 69개(31.22% 커버리지), S-문헌에서 297개(14.03% 커버리지)였다. 이는 시스템이 최소한의 사용자 개입으로 상당한 수의 관련 문서를 식별할 수 있음을 보여준다.

## Discussion
연구진은 PDVR에서 지식과 언어 습득 과정을 가속화하기 위한 모델과 VTA 프로토타입을 제시했다. 두 개의 분리된 문헌 집합에서 발견되는 연구 논문에 의해 문서화된 학제간 커뮤니케이션 채널을 정의하는 키워드의 분포를 모델링함으로써, 연구자의 특정 요구와 기대에 따라 시각화 논문 코퍼스의 개인화된 탐색을 유도하는 진입점을 생성할 수 있었다. 그러나 몇 가지 제한사항이 확인되었다: 첫째, 입력 데이터를 압축하는 데 사용된 스테밍 알고리즘이 일부 거짓 긍정을 생성했다. 둘째, GlassViz는 특정 파라미터(특이값 k의 수, 스무딩 알파 인자, 유사성 임계값 등)의 대화형 튜닝을 허용하지 않는다. 셋째, 키워드의 토큰화로 인해 진입점의 배경 주제를 해석하는 데 어려움이 증가했다.

## BibTeX Entry
```bibtex
@inproceedings{benito2020glassviz,
  title={GlassViz: Visualizing Automatically-Extracted Entry Points for Exploring Scientific Corpora in Problem-Driven Visualization Research},
  author={Benito-Santos, Alejandro and Therón, Roberto},
  booktitle={IEEE Visualization Conference},
  year={2020},
  organization={IEEE}
}
```