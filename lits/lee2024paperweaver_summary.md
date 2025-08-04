# PaperWeaver: Enriching Topical Paper Alerts by Contextualizing Recommended Papers with User-collected Papers

## Overview
### Problem Statement
연구자들은 빠르게 증가하는 학술 문헌을 따라잡기 위해 paper alert 시스템을 사용하지만, 추천된 논문이 자신의 연구 맥락과 어떻게 연관되는지 이해하는 데 어려움을 겪는다. 기존 시스템들은 제목과 초록만을 보여주어 연구자들이 추천 논문의 nuanced connections를 파악하기 위해 많은 인지적 노력을 들여야 한다.

### Approach
PaperWeaver는 Large Language Models (LLMs)를 활용하여 사용자가 수집한 논문들을 기반으로 추천 논문에 대한 맥락화된 설명을 생성한다. 시스템은 사용자의 연구 관심사를 추론하고, 논문의 context-specific aspects를 추출하며, 추천 논문과 수집된 논문을 비교하는 설명을 제공한다.

### Contribution
15명의 연구자를 대상으로 한 사용자 연구에서 PaperWeaver를 사용한 참가자들이 추천 논문의 관련성을 더 잘 이해하고 더 자신있게 triage할 수 있었으며, 추천 논문과 수집된 논문 간의 더 풍부한 관계를 포착할 수 있었다.

## Introduction
연구자들은 paper alert 시스템을 통해 최근 출판된 관련 논문들을 추천받지만, 각 논문의 관련성을 깊이 있게 이해하기 위해서는 새로운 정보와 기존 지식을 연결하는 의미 있는 연결고리를 찾아야 한다. 이 과정은 인지적으로 부담이 크며, 논문 제목만으로는 관련성을 파악하기 어렵고 초록을 자세히 읽어야만 논문이 어떻게 연구자의 관심사와 연결되는지 알 수 있다. 기존 추천 시스템들은 추천 논문들이 폴더 주제나 seed 논문들과 어떻게 관련되는지에 대한 정보를 거의 제공하지 않아, 사용자들이 잠재적 연결점을 찾기 위해 각 논문을 신중히 검토해야 하는 부담을 안고 있다.

## Related Work
### Facilitating Broad Scholarly Exploration and Paper Discovery
연구자들이 관련 논문을 탐색하고 발견하는 것을 돕기 위한 상당한 연구가 진행되어 왔다. SPECTER와 같은 시스템은 문서 간 인용을 활용하여 연구 논문의 내용 유사성을 인코딩하는 dense vector representations를 학습했다. 최근 연구들은 논문의 의미적 내용을 더 깊이 이해하여 연구 논문 검색을 용이하게 하는 데 초점을 맞추고 있으며, problem-method schema를 추출하여 창의성을 높이는 방향으로 발전하고 있다. 그러나 대부분의 기존 시스템들은 논문 내용과 분리된 외부 구조적 신호에 의존하거나, 논문 내용에 기반하지만 이해하기 어려운 잠재적 의미 신호에 의존한다는 한계가 있다.

### Reusing Related Work Sections for Deeper Scholarly Sensemaking
최근 연구들은 출판된 논문의 related work 섹션 내용을 재사용하여 연구자들이 문헌을 깊이 이해하도록 돕는 데 초점을 맞추고 있다. Relatedly는 많은 출판 논문에서 추출한 related work 섹션을 검색할 수 있게 하여 연구 분야의 landscape를 이해하는 데 도움을 준다. CiteSee와 CiteRead는 다른 논문에서 추출한 citing sentences (citances)를 활용하여 새로운 논문을 읽을 때 in-situ sensemaking 지원을 제공한다. 이러한 연구들과 달리, PaperWeaver는 사용자가 논문을 깊이 읽을 때가 아니라 paper alert를 통해 추천 논문을 이해하고 triage하는 것을 지원하는 데 초점을 맞춘다.

### Providing Contextualized Explanation
지식 습득은 새로운 정보를 기존 지식에 동화시키는 과정을 필요로 한다. 기존 연구들은 사용자의 기존 지식에 맞춰 맥락화된 설명을 제공하는 메커니즘과 효과를 탐구해왔다. 최근 NLP 연구에서는 LLM이 사용자가 작성한 이전 데이터나 콘텐츠를 기반으로 한 "user profiles"를 활용하여 생성된 텍스트를 개인화하는 방법을 조사했다. PaperWeaver는 이러한 연구 흐름을 기반으로 학자가 수집한 논문들을 폴더 설명으로 종합하고, 이를 새로운 논문 추천에 대한 맥락적 설명을 생성할 때 사용자의 관심사와 사전 이해를 나타내는 표현으로 활용한다.

## Formative Study
7명의 대학원생을 대상으로 한 형성적 연구를 통해 기존 paper alert 시스템의 문제점과 연구자들이 원하는 정보 유형을 파악했다. 참가자들은 추천 논문들이 자신의 폴더 주제와 어떻게 관련되는지 파악하는 것이 가장 큰 도전 과제라고 언급했으며, 제목과 초록만으로는 논문을 저장하고 읽을지 빠르게 결정하기 어렵다고 했다. 참가자들은 폴더 이름과 관련된 정보를 포함하는 LLM 생성 맥락화된 요약을 선호했으며, 추천 논문과 수집된 논문 간의 연결을 보여주는 설명이 논문들이 문헌 내에서 어떻게 위치하는지 이해하는 데 도움이 된다고 평가했다. 또한 참가자들은 추천 논문과의 연결을 통해 이전에 수집한 논문들에 대한 새로운 통찰을 얻을 수 있다는 점을 발견했다.

## PaperWeaver
### System Design and Visualization Features
PaperWeaver는 사용자가 수집한 논문들을 기반으로 추천 논문에 대한 맥락화된 설명을 제공하는 paper alert 시스템이다. 시스템의 주요 시각화 및 인터페이스 구성요소는 다음과 같다:

1. **Paper Card Interface**: 각 추천 논문은 카드 형태로 표시되며, 제목, 저자, 학회, 출판 연도 정보를 포함한다. 카드 하단에는 세 개의 탭으로 구성된 설명이 제공된다.

2. **Three-Tab Description System**:
   - **Relate to Paper 탭**: 추천 논문과 폴더 내 기존 논문 간의 관계를 보여주는 paper-paper descriptions를 제공한다. 사용자는 드롭다운을 통해 비교할 논문을 선택할 수 있으며, 두 논문이 서로 다른 색상으로 하이라이트되어 구분된다.
   - **Problem, Method, and Findings 탭**: 폴더 컨텍스트와 관련된 추천 논문의 contextualized aspect-based summaries를 problem, method, findings 세 가지 측면으로 나누어 보여준다.
   - **Abstract 탭**: 논문의 원본 초록을 표시한다.

3. **Interactive Features**: 사용자는 추천 논문을 폴더에 저장하고 향후 참조를 위한 노트를 작성할 수 있다.

### LLM-based Pipeline for Generating Descriptions
PaperWeaver는 세 가지 유형의 설명을 생성한다:

1. **Contextualized Aspect-based Paper Summaries**: 사용자의 연구 관심사를 반영하여 추천 논문의 problem, method, findings를 추출한다. LLM은 폴더 설명과 추천 논문의 제목 및 초록을 입력으로 받아, 폴더 주제와 관련된 여러 문제들을 식별하고 각 문제에 대한 구체적인 방법과 발견사항을 설명한다.

2. **Paper-paper Descriptions Based on Citances**: 추천 논문이 수집된 논문을 인용하는 경우, citation sentences (citances)와 citing paragraph를 활용하여 두 논문 간의 관계를 설명한다. 시스템은 background intent를 가진 citances를 우선적으로 선택하여 추천 논문이 어떻게 수집된 논문을 기반으로 구축되는지 보여준다.

3. **Paper-paper Descriptions via Generated Pseudo-citances**: 추천 논문이 수집된 논문을 인용하지 않는 경우, LLM을 활용하여 두 논문 간의 잠재적 관계를 생성한다. 시스템은 먼저 abstract 유사성을 기반으로 상위 5개 관련 논문을 선택하고, problem-method-findings schema를 사용하여 유사점과 차이점을 식별한 후, 두 논문을 비교 대조하는 구조화된 요약을 생성한다.

### Literature Review Support Features
PaperWeaver가 문헌 리뷰를 지원하는 구체적인 측면들:

1. **Contextual Relevance Surfacing**: 시스템은 추천 논문의 어떤 부분이 사용자의 폴더 주제와 관련되는지 명시적으로 하이라이트하여, 연구자들이 관련성을 빠르게 파악할 수 있도록 돕는다.

2. **Relationship Mapping**: 추천 논문과 이미 수집된 논문 간의 "build on", "extend", "contrast" 등의 관계를 명확히 제시하여 문헌의 발전 과정을 이해하도록 돕는다.

3. **Knowledge Anchoring**: 익숙하지 않은 추천 논문을 이미 알고 있는 수집된 논문과 연결하여 설명함으로써 새로운 정보를 기존 지식에 통합하는 인지적 부담을 줄인다.

4. **Multi-perspective Understanding**: 동일한 추천 논문에 대해 여러 수집된 논문과의 관계를 탐색할 수 있게 하여 다각도의 이해를 지원한다.

## User Study
15명의 CS 분야 대학원생을 대상으로 within-subjects 연구를 수행했다. 참가자들은 자신의 실제 수집 논문을 기반으로 생성된 paper alert를 PaperWeaver와 baseline 시스템(초록과 related work 섹션을 제공)에서 각각 12분간 검토했다. 연구 결과, PaperWeaver 사용 시 참가자들이 추천 논문의 관련성을 더 잘 이해했고(평균 6.07 vs 3.80, p=0.0013), 저장할 논문을 결정하는 데 더 도움이 되었으며(5.27 vs 4.00, p=0.0024), 결정에 더 자신감을 가졌다(6.07 vs 5.33, p=0.0124). 또한 참가자들은 PaperWeaver를 사용할 때 논문 간 연결을 설명하는 노트를 평균적으로 더 많이 작성했다(2.21 vs 1.07, p=0.0459).

## Discussion
사용자 연구를 통해 참가자들이 PaperWeaver의 설명을 검증 가능한 "supplementary material"로 적절히 활용하며, LLM 생성 콘텐츠를 맹목적으로 신뢰하지 않고 초록이나 논문 내용과 대조하여 확인하는 전략을 사용함을 발견했다. 시스템의 한계로는 CS 분야 대학원생만을 대상으로 했다는 점, Problem-Method-Findings schema가 모든 논문 유형에 적합하지 않을 수 있다는 점, 그리고 LLM이 생성한 설명에서 일부 사실적 오류가 발견된다는 점(contextualized aspect-based description 8%, paper-paper description 20%)이 있다. 향후 연구 방향으로는 사용자가 설명의 복잡도를 조정할 수 있게 하는 것, 사용자의 이해도 변화를 반영하여 폴더 설명을 진화시키는 것, 그리고 Problem-Method-Findings를 넘어선 사용자 정의 스키마를 지원하는 것 등이 제시되었다.

## BibTeX Entry
```bibtex
@inproceedings{lee2024paperweaver,
  title={PaperWeaver: Enriching Topical Paper Alerts by Contextualizing Recommended Papers with User-collected Papers},
  author={Lee, Yoonjoo and Kang, Hyeonsu B and Latzke, Matt and Kim, Juho and Bragg, Jonathan and Chang, Joseph Chee and Siangliulue, Pao},
  booktitle={Proceedings of the CHI Conference on Human Factors in Computing Systems},
  pages={1--19},
  year={2024},
  publisher={ACM},
  doi={10.1145/3613904.3642196}
}
```