# Augmenting Scientific Papers with Just-in-Time, Position-Sensitive Definitions of Terms and Symbols

## Overview
### Problem Statement
과학 논문을 읽을 때 독자들은 논문 내에서 정의된 기술 용어와 기호(nonce words)를 이해하는 데 어려움을 겪는다. 이러한 nonce words는 특정 논문 내에서만 사용되는 용어로, 독자가 미리 그 의미를 알 수 없으며 논문의 다른 부분에서 정의를 찾아야 한다. 한 논문에는 수백 개의 nonce words가 포함될 수 있으며, 동일한 기호가 여러 의미를 가질 수 있어 읽기 흐름을 방해한다.

### Approach
연구진은 ScholarPhi라는 증강 읽기 인터페이스를 개발했다. 이 시스템은 네 가지 주요 기능을 제공한다: (1) 위치 민감형 정의를 보여주는 툴팁, (2) 특정 용어의 사용처만 강조하는 "declutter" 필터, (3) 수식 내 모든 기호의 정의를 동시에 보여주는 자동 생성 수식 다이어그램, (4) 중요 용어와 기호의 자동 생성 용어집.

### Contribution
27명의 연구자를 대상으로 한 사용성 연구에서 ScholarPhi는 표준 PDF 리더에 비해 질문에 답하는 시간을 단축시키고, 논문의 더 적은 부분만 보고도 답을 찾을 수 있게 했다. 연구자들은 특히 정의 툴팁과 수식 다이어그램을 향후 논문 읽기에 "자주" 또는 "항상" 사용하고 싶다고 응답했다.

## Introduction
연구자들은 방대하고 빠르게 변화하는 문헌을 따라가야 하는 과제를 안고 있다. 선임 연구자들은 연간 100시간 이상을 문헌 읽기에 할애하며 100편 이상의 논문을 읽는다. 그러나 경력을 통해 쌓은 배경 지식에도 불구하고 논문이 지나치게 어려워 읽기 힘든 경우가 많다. 특히 수학적 내용이 포함된 논문은 익숙하지 않은 용어와 표기법으로 인해 추가적인 인지적 부담을 준다. 이 연구는 읽기 흐름을 방해하는 요소를 줄여 새로운 인터페이스가 읽기 경험을 개선할 수 있는지 탐구한다.

## Related Work
연구진은 증강 읽기 인터페이스의 역사와 발전을 검토했다. Vannevar Bush의 memex 비전부터 하이퍼텍스트의 발명, 인터랙티브 도서와 "유동적 문서" 실험에 이르기까지 지식 노동자의 읽기 중 인지 확장을 위한 도구 개발이 HCI의 핵심 과제였다. 용어집과 정의 제공 도구로는 Amazon Kindle의 Word Wise 기능과 Wikipedia의 페이지 미리보기가 있다. 수학 텍스트 읽기를 위한 도구로는 e-Proofs와 Planetary 시스템이 개발되었다. 그러나 텍스트를 인터랙티브하게 만들 때 독자를 돕는 것과 방해하는 것 사이의 긴장관계가 존재한다는 점이 중요하다.

## Design Motivations
연구진은 반복적 디자인 과정을 통해 다음과 같은 디자인 동기를 도출했다. 첫째, 정의는 출현 위치에 맞게 조정되어야 한다 - 동일한 기호가 논문 전체에서 여러 의미를 가질 수 있기 때문이다. 둘째, 독자를 문맥 속 정의로 연결해야 한다. 셋째, 흩어진 정보를 통합해서 제공해야 한다. 넷째, 클릭 가능한 단어에 대한 시각적 단서(scent)를 제공해야 한다. 다섯째, 텍스트 가림을 최소화해야 한다. 여섯째, 주의 분산을 최소화해야 한다. 일곱째, 오류 복구를 지원해야 한다.

## User Interface
ScholarPhi는 네 가지 주요 기능을 제공한다. 정의 툴팁은 nonce word를 클릭하면 해당 단어 바로 아래에 나타나며, 위치 민감형으로 가장 최근에 나타난 정의를 보여준다. Declutter 기능은 선택한 nonce word가 포함된 문장만 강조하고 나머지는 흐리게 처리하여 빠른 정보 검색을 돕는다. 수식 다이어그램은 디스플레이 수식의 모든 기호에 대한 정의를 동시에 표시하며, 리더 라인으로 정의와 기호를 연결한다. 프라이밍 용어집은 논문 시작 부분에 추가되어 주요 용어와 기호의 목록을 제공한다.

## Implementation
ScholarPhi는 TeX/LaTeX 기반 PDF를 분석하여 방정식, 기호, 문장의 정확한 위치를 찾는다. 구현은 TeX 소스에 고유한 색상을 할당하고, 색상이 지정된 PDF를 컴파일한 후, 이미지로 렌더링하여 색상을 감지하는 방식으로 작동한다. 복합 기호 감지를 위해 KaTeX 파서를 확장하여 MathML 문서를 생성하고 분석한다. 정의 인식은 최신 자연어 처리 모델, 약어 확장 모델, 언어학적 규칙을 조합하여 수행된다. 사용자 인터페이스는 Mozilla의 pdf.js를 기반으로 구현되었다.

## Usability Study
27명의 연구자(박사과정생 18명, 석사과정생 5명, 학부생 3명, 전문 연구자 1명)를 대상으로 원격 사용성 연구를 수행했다. 참가자들은 세 가지 인터페이스(Basic PDF 리더, Declutter 기능만 있는 리더, 모든 기능을 갖춘 ScholarPhi)를 사용하여 기계학습 논문을 읽고 질문에 답했다. ScholarPhi 사용 시 참가자들은 유의미하게 적은 시간으로 질문에 답했으며(평균 45.4초 단축), 논문의 더 적은 부분만 봐도 답을 찾을 수 있었다(25% 감소). 참가자들은 답변에 대한 확신도와 답 찾기의 용이성에서도 ScholarPhi를 더 높게 평가했다.

## Discussion
사용성 연구 결과는 ScholarPhi가 nonce words 이해가 필요한 복잡한 과학 논문 읽기를 효과적으로 지원함을 보여준다. 96%의 독자가 15분간의 자유 읽기 시간 동안 ScholarPhi 기능을 최소 1회 이상 사용했으며, 기호 툴팁은 중앙값 10회, 용어 툴팁은 중앙값 5회 열렸다. 독자들은 이 도구가 읽기 흐름 유지, 이해도 확인, 전문 분야 외 논문 읽기의 진입 장벽 낮추기에 도움이 된다고 보고했다. 향후 연구 방향으로는 논문 외부 정의 연결, 기계학습 모델과 읽기 인터페이스의 공동 개발, 과학 논문 작성 지원 도구 개발이 제시되었다.

## BibTeX Entry
```bibtex
@inproceedings{head2021augmenting,
  title={Augmenting Scientific Papers with Just-in-Time, Position-Sensitive Definitions of Terms and Symbols},
  author={Head, Andrew and Lo, Kyle and Kang, Dongyeop and Fok, Raymond and Skjonsberg, Sam and Weld, Daniel S. and Hearst, Marti A.},
  booktitle={CHI Conference on Human Factors in Computing Systems (CHI '21)},
  pages={1--18},
  year={2021},
  organization={ACM},
  doi={10.1145/3411764.3445648}
}
```