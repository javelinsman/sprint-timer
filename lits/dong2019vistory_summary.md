# VIStory: Interactive Storyboard for Exploring Visual Information in Scientific Publications

## Overview

### Problem Statement
많은 시각적 분석 도구들이 과학 출판물의 저자나 인용 정보와 같은 메타데이터를 탐색하기 위해 개발되었지만, 과학 출판물에서 스토리텔링과 방법론 설명을 위해 널리 사용되는 시각적 정보(그림)는 종종 간과되어 왔다. 특히 시각화 분야와 같이 실질적인 시각 정보를 포함하는 과학 출판물의 경우, 이러한 그림들이 연구의 내용과 품질을 반영하는 중요한 요소임에도 불구하고 체계적으로 분석되지 못했다.

### Approach
VIStory는 과학 출판물에서 시각 정보를 탐색하기 위한 대화형 스토리보드 시스템으로, 자동 그림 추출 방법을 사용하여 대규모 그림 코퍼스를 수집하고, 각 그림의 다양한 속성(지배적 색상, 가로/세로 비율 등)과 출판물의 다면적 메타데이터(학회, 저자, 키워드)를 함께 분석한다. 이를 위해 세 가지 주요 뷰 컴포넌트를 제공한다: Faceted View, Storyboard View, Endgame View.

### Contribution
이 연구는 과학 출판물에서 그림을 자동으로 추출하는 방법을 개발하고, 2009-2018년 IEEE VIS 출판물에서 1,171개의 그림을 수집했다. 또한 출판물의 다차원 그림 속성을 표현하는 paper ring이라는 컴팩트한 글리프 디자인을 제안하고, 이를 themeriver 레이아웃으로 배치하여 시간적 추세를 보여주는 시각화 시스템을 구현했다.

## Introduction
출판물은 과학 연구의 가장 중요한 결과물 중 하나이며, 과학의 발전과 함께 방대한 양의 과학 출판물이 생성되어 왔다. Google Scholar나 Microsoft Academic과 같은 디지털 라이브러리가 강력한 검색 및 브라우징 기능을 제공하지만, 협업 분석과 같은 고수준 작업에는 종종 비효율적이다. 시각적 분석은 인간의 인지와 추론을 기계의 강력한 컴퓨팅 능력과 결합할 수 있어 과학 출판물 탐색에서 큰 관심을 받았다. 그러나 기존의 시각적 분석 도구들은 주로 저자나 인용과 같은 출판물의 메타데이터에 초점을 맞추었고, 사실, 방법론, 스토리텔링을 위해 사용되는 그림과 같은 시각 정보는 무시했다. 특히 시각화 분야에서는 연구 과정에서 이미지 데이터가 생성되며, 이는 연구의 내용과 품질을 실질적으로 반영할 수 있다.

## Related Work
문서 시각 분석 분야에서는 PaperVis와 CiteRivers(인용 분석), egoSlider와 Vis Author Profile(저자 분석) 등 다양한 시스템이 개발되었지만, 과학 출판물의 시각 정보를 묘사하는 시각화는 거의 없었다. Strobelt 등은 주요 그림과 중요 용어를 컴팩트하게 구성하여 문서의 추상화를 생성했고, Schulz는 모든 트리 시각화 기법을 수집하여 대화형 탐색을 지원하는 참조 시스템을 개발했다. 그러나 이러한 시각화들은 소량의 문서에만 적합하거나 유지보수를 위해 개발자의 전문성에 크게 의존한다는 한계가 있었다. 이미지 브라우저 분야에서는 쌍별 이미지 유사성을 기반으로 레이아웃에 이미지를 구성하는 일반적인 접근법이 사용되었으며, 이미지의 의미 정보나 다차원 메타데이터를 활용하는 방법들도 개발되었다.

## Modeling Publication Figure
이 연구는 IEEE VIS 컨퍼런스(VAST, InfoVis, SciVis 포함)의 대표적인 시각화들을 실험 대상으로 했으며, 필드의 추세를 더 잘 이해하기 위해 2009-2018년의 과거 10년간 논문을 선택했다. 총 1,171편의 논문을 수집했으며, 이 중 383편은 VAST, 403편은 InfoVis, 385편은 SciVis였다. 자동 그림 추출을 위해 PDF를 JPG 이미지와 XML 파일로 변환하고, "Fig."나 "Figure"와 같은 키워드를 검색하여 그림 캡션이나 설명을 식별하는 방법을 개발했다. 추출된 데이터는 중첩 테이블 구조로 구성되어, 출판 연도와 다른 속성(학회, 저자, 키워드, 그림 수)으로 그룹화되며, 각 출판물은 그림을 행으로, 그림 속성(이미지 크기, 가로/세로 비율, 색상)을 열로 하는 테이블로 표현된다.

## VIStory Interface
### Design Rationales
직관적인 시각 디자인은 다음 세 가지 원칙을 충족해야 한다: Complete(출판물 메타데이터와 그림 속성 모두를 탐색할 수 있어야 함), Overview + Details(방대한 그림들의 개요를 제공하고 상세 탐색을 위한 인터랙티브 기법을 통합해야 함), Faceted Browsing(다면적 메타데이터를 사용하여 그림을 조작하고 분석할 수 있어야 함).

### Faceted View
Faceted View는 Venues, Authors, Keywords, Num. of Figures의 네 가지 패널로 구성되며, 각 패널은 해당 메타데이터의 속성들을 포함한다. 속성들은 출판물 수에 따라 내림차순으로 정렬되며, 사용자는 관심 있는 속성을 클릭하여 출판물을 시각적으로 쿼리할 수 있다. 같은 패싯에서 여러 속성을 선택하면 합집합(union) 연산이, 다른 패싯에서 선택하면 교집합(intersection) 연산이 적용된다.

### Storyboard View
#### Paper Ring
Paper ring은 한 출판물의 모든 그림을 호(arc)로 표현하는 글리프로, 시계 방향으로 출판물의 그림 순서대로 배치된다. 각 그림의 크기는 호의 길이로, 가로/세로 비율은 호의 높이로, 지배적 색상은 호의 색상으로 인코딩된다. 호의 길이는 같은 출판물 내 그림들의 상대적 크기만을 나타내며, 모든 paper ring은 동일한 반지름을 공유한다.

#### Themeriver
Paper ring들은 시간적 추세를 표현하기 위해 themeriver 레이아웃으로 배치된다. 렌더링 캔버스는 10개의 동일한 부분으로 수평 분할되어 10년간의 출판 연도를 나타내며, 강의 높이는 출판물 수에 해당한다.

#### Layout
Paper ring을 themeriver 내에 의미 있게 배치하기 위해 greedy 알고리즘을 개발했다. 이 알고리즘은 경계 상자를 다양한 열과 행으로 나누어 최적의 paper ring 반지름을 찾고, 같은 그룹의 paper ring들이 서로 가깝게 배치되도록 한다.

### Endgame View
Endgame View는 좌측에 원본 그림을, 우측에 제목, 저자, 학회, 키워드, 그림 순서 등의 출판물 메타데이터를 표시한다. 이 뷰는 해당 호의 중심과 점선으로 연결되며, 중요한 시각 요소의 가림을 피하기 위해 드래그할 수 있다. 여러 endgame view를 동시에 활성화하여 비교할 수 있다.

## Case Study
### Study 1: Author Profile Probe
중국 본토의 활발한 시각화 연구자 7명(Shixia Liu, Xiaoru Yuan, Yingcai Wu, Wei Chen, Weiwei Cui, Nan Cao, Yunhai Wang)의 프로필을 조사했다. 분석 결과, Huamin Qu가 선택된 7명의 연구자들과 가장 많은 협업을 했으며, Hanqi Guo와 Xiaoru Yuan, Mengchen Liu와 Shixia Liu가 지도교수-학생 관계였을 가능성이 높다는 것을 발견했다. 또한 2014년에 출판물이 가장 많았고 2011년과 2015년에는 상대적으로 적었다는 시간적 패턴도 관찰했다.

### Study 2: VIS Trend Analysis
Interaction, Volume Rendering, Machine Learning 세 가지 주요 키워드의 추세를 분석했다. Interaction에 대한 출판물 수는 매년 상대적으로 안정적이었고, Volume rendering은 점점 인기가 떨어지는 반면, Machine learning은 최근 2년간 더 많은 출판물이 채택되었다. 특히 머신러닝 관련 출판물의 대부분이 VAST 컨퍼런스에 있었으며, 이는 딥러닝 기법의 블랙박스를 열기 위한 시각 분석 시스템들이 개발되었기 때문인 것으로 확인되었다.

## Discussion
VIStory는 저자 프로필 조사와 시각화 추세 이해에 효과적임을 보여주었다. 그러나 이 분석이 과거 10년간의 IEEE VIS 출판물에만 수행되어 시각화 작업의 일부만을 다룬다는 한계가 있다. 예를 들어, volume rendering은 IEEE Transactions on Medical Imaging과 같은 다른 학회에도 많이 출판되었고, 저자들의 IEEE TVCG 출판물은 포함되지 않았다. 확장성 측면에서도 출판물 총 수가 1000개에 도달하면 Storyboard View의 paper ring이 너무 작아져 관찰하기 어려워지는 문제가 있다.

## Conclusion and Future Work
VIStory는 과학 출판물에서 수집된 시각 정보의 대화형 탐색을 지원하는 새로운 스토리보드 시스템이다. 자동 그림 추출 방법을 개발하고, paper ring이라는 새로운 글리프 디자인을 제안하여 출판물의 다차원 그림 속성을 인코딩했으며, 이를 themeriver 레이아웃으로 구성하여 시간적 변화를 묘사했다. 향후 연구 방향으로는 데이터셋을 공개하여 딥러닝 기법을 사용한 시각화 관련 이미지 메트릭 추출 연구를 가능하게 하고, IEEE TVCG, EuroVis, PacificVis의 출판물로 데이터를 확장하며, 더 많은 분석 기능을 통합하고 시스템 확장성을 개선하는 것이 포함된다.

## BibTeX Entry
```bibtex
@inproceedings{dong2019vistory,
  title={VIStory: Interactive Storyboard for Exploring Visual Information in Scientific Publications},
  author={Dong, Ao and Zeng, Wei and Chen, Xi and Cheng, Zhanglin},
  booktitle={VINCI '19: International Symposium on Visual Information Communication and Interaction},
  pages={1--8},
  year={2019},
  organization={ACM}
}
```