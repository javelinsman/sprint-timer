# Citeology: Visualizing Paper Genealogy
## Overview
### Problem Statement
연구 논문들 간의 인용 관계를 이해하는 것은 연구자들에게 중요하지만, 기존의 텍스트 기반 인용 표시 방법은 한 논문의 직접적인 참조 논문(부모)과 인용한 논문(자식)만을 보여줄 뿐, 여러 세대에 걸친 인용 관계나 전체적인 연결 네트워크를 파악하기 어렵다는 한계가 있다.

### Approach
Citeology는 논문들 간의 인용 관계를 계보학적 관점에서 시각화하는 인터랙티브 시스템으로, 1982년부터 2010년까지 ACM CHI와 UIST에서 출판된 3,502개의 논문과 그들 사이의 11,699개의 인용 관계를 시각화한다. 각 논문은 연도별로 수직 열에 배치되고, 인용 관계는 곡선으로 연결되며, 사용자가 특정 논문을 선택하면 그 논문의 조상(ancestors)과 후손(descendants) 논문들이 각각 빨간색과 파란색 선으로 표시된다.

### Contribution
이 연구는 (1) 논문 인용 관계를 여러 세대에 걸쳐 시각화하는 새로운 방법을 제시하고, (2) CHI/UIST 논문 데이터베이스를 통해 인용 패턴에 대한 흥미로운 발견을 보고하며, (3) 연구자들이 관련 연구를 찾고 특정 연구 주제의 역사를 추적하는 데 도움을 주는 도구를 제공한다.

## Introduction
연구 출판물은 인용을 통해 이전 연구와의 관계를 보여주며, ACM Digital Library나 Google Scholar 같은 온라인 저장소를 통해 특정 논문이 어떤 미래 논문들에 의해 인용되었는지 확인할 수 있게 되었다. 그러나 기존 방법들은 한 논문의 직접적인 부모와 자식 관계만을 보여줄 뿐, 여러 세대의 조상이나 후손을 보거나 전체 코퍼스의 연결 네트워크를 파악할 수 있는 방법은 없었다. Citeology는 citation과 genealogy의 합성어로, 유사한 학회에서 출판된 논문 컬렉션의 맥락에서 출판물 간의 인용 관계를 시각화하도록 설계된 인터랙티브 시각화 도구이다.

## Related Work
인용 트렌드의 시각화와 관련하여 여러 연구가 진행되어 왔다. Butterfly 시스템은 인용 데이터베이스에 접근하기 위한 인터페이스로 산점도와 3D 파일로 논문 검색 결과를 시각화했으며, CiteSense는 문헌 검색, 선택, 이해를 지원하도록 설계되었다. Eigenfactor는 논문의 인용 데이터를 사용하여 저널의 강도를 순위화하고, Well-formed Eigenfactor는 이 데이터를 기반으로 저널 수준에서 매력적인 시각화를 만들었다. Alt.CHI 2009에서 Kaye는 개별 저자 수준의 이슈에 초점을 맞춘 HCI 출판물 분석을 발표했고, MacKenzie는 CHI, TOCHI, HCI Journal의 HCI 인용을 살펴보며 HCI 연구자들이 "거의 또는 전혀 영향력이 없다"는 주장을 반박했다.

## The Citeology System
Citeology 시스템은 1982년부터 2010년까지 ACM CHI와 ACM UIST에서 출판된 모든 3,502개의 논문과 이들 사이의 11,699개의 인용을 데이터셋으로 사용한다. 논문들은 연도별로 수직 열에 구성되며 각 논문 제목의 첫 25자 정도가 표시된다. 논문들은 각 연도에서 가장 많이 인용된 논문들이 해당 열의 중앙에 위치하도록 정렬되어, 가장 많이 인용된 논문들을 다이어그램의 중앙을 가로지르는 수평 띠를 따라 찾을 수 있다.

개별 논문을 클릭하면 해당 논문의 Citeology를 볼 수 있다. 논문의 후손들은 파란색 선으로 연결되고 조상들은 빨간색으로 연결된다. 기본적으로 양방향의 모든 세대의 관련 논문들이 표시되지만, 1세대부터 8세대까지 제한할 수 있는 컨트롤이 제공된다. 1세대 관련 논문들은 상대적으로 두껍고 불투명한 곡선으로 연결되며, 세대 간격이 증가할수록 선은 더 얇고 투명해진다. 관련된 모든 논문의 이름은 진하게 표시되며, 1세대 연관성이 가장 진하고 더 먼 세대는 점점 밝아진다.

논문이 선택되면, 다른 논문 위에 마우스를 올리면 해당 논문과 선택된 논문 사이의 최단 연결이 존재할 경우 표시된다. 경로는 시각화에 추적되고 최단 경로상의 논문들이 화면 왼쪽 상단에 표시된다. "Find Paper..." 버튼을 클릭하면 제목이나 저자의 단어를 사용하여 논문을 찾을 수 있고, "visit paper page" 버튼을 통해 논문의 공식 ACM 페이지에 접근할 수 있다.

## Implementation
Citeology 시스템은 Java 애플릿으로 구현되었으며 Processing 라이브러리를 사용하여 화면 그리기와 PDF 생성 절차를 단순화했다. Java 애플릿이므로 웹페이지에 임베드될 수 있으며, 동일한 소스 코드 베이스에서 Windows, Mac OS, Linux에서 실행 가능한 독립형 애플리케이션을 빌드할 수 있다. 애플릿은 서명되어 있어 익명 사용 데이터를 Amazon AWS SimpleDB 데이터베이스에 수집하고 생성된 PDF 파일을 사용자의 로컬 파일 시스템에 저장할 수 있다.

데이터는 탭으로 구분된 텍스트 파일에 저장되며, Conference, Year, Title, Abstract, Authors, DOI, References 필드를 포함한다. 여러 개의 항목을 가질 수 있는 필드(Authors와 References)에는 물결표(~) 문자가 보조 구분자로 사용된다. Digital Object Identifier (DOI) 시스템이 각 논문의 고유 식별자로 사용되며, 이를 통해 출판물의 공식 웹 페이지로 쉽게 참조할 수 있다.

## Interesting Findings
여러 세대에 걸쳐 가장 많은 후손을 가진 논문들을 분석한 결과, 1세대 후손이 가장 많은 논문은 CHI 1986의 "Generalized Fisheye Views"로 CHI/UIST 컬렉션 내에서 89개의 직접 인용을 받았다. 이 논문은 5세대까지 1,663개의 후손으로 1위를 유지하지만, 6세대를 보면 CHI 1986의 "A Study in Two Handed Input"이 1,760개의 후손으로 가장 많아진다. 7세대 이상에서는 CHI 1983의 "Evaluation and analysis of users' activity organization"이 가장 많은 총 후손을 가지며, 7세대 이하 1,887개, 전체적으로 2,120개의 후손을 가진다. 놀랍게도 1993년 이후 출판된 모든 논문의 62%, 2010년 CHI와 UIST에서 출판된 논문의 84%가 이 논문의 후손이다.

두 논문 사이의 가장 긴 직접 연결은 CHI 1985의 "A theory of stimulus-response compatibility applied to human-computer interaction"과 CHI 2008의 "The effects of empathetic virtual characters on presence in narrative-centered learning environments" 사이의 18세대 간격이었다. 또한 시각화를 탐색하면서 인용의 대부분이 논문들의 중간 행을 따라 묶여 있음을 볼 수 있는데, 이는 가장 많이 인용된 논문들이 중앙에 배치되도록 정렬한 결과이다. 흥미롭게도 1982년과 2009년 사이에 출판된 3,159개 논문 중 934개가 컬렉션 내의 다른 논문에 의해 한 번도 참조되지 않았다.

## Usage Observations
Citeology는 공개 배포 후 약 3주 동안 2,977개의 고유 호스트 컴퓨터에서 3,681번 실행되었다. 이 세션 동안 사용자 커뮤니티는 24,378개의 논문을 선택하여 조회했다. 가장 많이 선택된 논문들을 분석한 결과, 사람들은 컬렉션의 시작과 끝 날짜의 논문들과 다이어그램 중앙을 가로지르는 가장 인기 있는 논문들의 띠에 가장 관심이 많았다. 대부분의 논문이 적어도 한 번의 클릭을 받았으며, 3,502개 중 207개(5.9%)만이 0번 선택되었다. 가장 많이 선택된 논문은 Richard A. Bolt의 CHI 1982 논문 "Eyes at the Interface"로, 1982년 컬렉션에서 가장 자주 인용된 논문이다.

## Discussion and Future Work
이 초기 배포에서 사용된 데이터베이스가 CHI와 UIST에서 출판된 논문만을 사용하기 때문에 모든 종속 관계를 포착할 수는 없다. 예를 들어, CHI의 논문 A가 AVI의 논문 B에 의해 참조되고, 이것이 다시 CHI의 논문 C에 의해 참조되는 경우, 현재 시각화에서는 논문 C가 논문 A의 후손으로 나타나지 않는다. 데이터베이스의 논문 범위를 확장하면 논문의 계보에 대한 더 완전한 그림을 만드는 데 도움이 될 것이다.

학술 논문과 관련된 참조는 일반적으로 맥락 정보가 없기 때문에 Citeology는 현재 모든 인용을 동등하게 취급한다. 그러나 논문은 새 논문이 구축하는 좋은 선행 연구의 예이기 때문에 참조될 수 있을 뿐만 아니라, 배경 정보를 얻기 위해 참조되거나 저자가 그들의 발견에 동의하지 않아서 참조될 수도 있다. CiTO 시스템에서 설명하는 것처럼 작업이 인용될 수 있는 다른 많은 이유가 있으며, 인용이 맥락에서 어떻게 사용되는지에 따라 (수동으로 또는 자동으로) 분류할 수 있다면 유용할 것이다.

애플릿에서 확대/축소 기능이 없는 것은 향후 버전에서 해결하고자 하는 부분이며, 현재는 더 자세한 검사를 위해 PDF 파일을 생성하는 방법을 우회책으로 사용한다. 구현 측면에서는 현재의 Java 설치 종속성을 제거하기 위해 애플리케이션을 HTML5 Canvas 기반 페이지로 재작성하는 것이 좋을 것이다.

## BibTeX Entry
```bibtex
@inproceedings{matejka2012citeology,
  title={Citeology: Visualizing Paper Genealogy},
  author={Matejka, Justin and Grossman, Tovi and Fitzmaurice, George},
  booktitle={CHI '12 Extended Abstracts on Human Factors in Computing Systems},
  pages={181--190},
  year={2012},
  organization={ACM}
}
```