# Threddy: An Interactive System for Personalized Thread-based Exploration and Organization of Scientific Literature

## Overview
### Problem Statement
문헌 리뷰 과정에서 연구자들은 관련 연구 스레드를 찾고 이해하는 데 어려움을 겪습니다. 기존 연구들이 이미 요약한 연구 스레드를 활용하려 해도, 참조 표기와 실제 논문을 연결하고, 맥락을 유지하며 여러 논문을 탐색하는 과정에서 잦은 컨텍스트 스위칭이 발생합니다. 논문이 기하급수적으로 증가하면서 이러한 문제는 더욱 심화되고 있습니다.

### Approach
Threddy는 연구자의 PDF 읽기 과정에 직접 통합되는 시스템으로, 논문의 서론이나 관련 연구 섹션에서 저자들이 이미 요약한 연구 스레드를 효율적으로 추출하고 조직할 수 있게 합니다. 사용자가 텍스트를 하이라이트하면 자동으로 참조 논문들을 추출하고 메타데이터와 연결하며, 이를 계층적 스레드 구조로 조직할 수 있도록 지원합니다.

### Contribution
1) 읽기 흐름을 방해하지 않으면서 pre-digested synthesis를 활용할 수 있는 in-situ 인터페이스 설계, 2) 하이라이트된 텍스트에서 자동으로 참조를 추출하고 메타데이터와 연결하는 기능, 3) 계층적 스레드 구조를 통한 개인화된 연구 조직 방법, 4) 각 스레드와 관련된 새로운 논문을 추천하는 discovery 기능을 제공합니다.

## Introduction
과학 문헌을 검토하여 관련 연구 스레드를 이해하는 것은 연구의 핵심적인 부분이며 학습의 수단입니다. 그러나 문헌의 양이 증가하면서 다양한 연구 스레드를 찾고 이해하는 데 어려움이 커지고 있습니다. 연구자들은 종종 다른 학자들이 이미 조합한 연구 스레드를 활용하는 전략을 사용하는데, 이는 논문의 서론이나 관련 연구 섹션에서 저자들이 자신의 기여를 위치시키기 위해 압축하고 요약한 연구 스레드를 읽는 과정입니다. 그러나 이 과정조차도 번거롭습니다. 참조 표기와 실제 논문을 연결하고, 논문을 찾고, 메모를 작성하는 과정에서 읽기 흐름이 자주 중단됩니다. Threddy는 이러한 격차를 해결하기 위해 개발되었습니다.

## Related Work
관련 연구는 세 가지 주요 스레드로 구성됩니다. 첫째, 문서 내부 및 문서 간 상호작용을 지원하는 도구들이 있습니다. Passages는 임시적인 텍스트 선택을 지속적인 객체로 구체화하고, texSketch는 개별 문서와의 깊은 상호작용을 위한 대화형 캔버스를 개발했습니다. 둘째, 읽기 경험을 증강하는 도구들이 있습니다. 복잡한 연구 논문을 읽는 데 따르는 인지적 비용을 줄이기 위해 문서 내 상호 참조를 개선하거나 맥락적으로 관련된 토론을 문서 여백에 바인딩하는 연구들이 있었습니다. 셋째, 문헌 리뷰 워크플로우를 위한 도구들이 있습니다. PaperQuest, CiteSense 등은 독립적인 정보 환경에서 문헌 리뷰 프로세스를 지원하는 시스템들입니다. 그러나 이들은 사용자의 읽기 흐름에서 분리된 독립적인 환경을 제공한다는 한계가 있습니다.

## Usage Scenario and System Design
사용자 Sam이 논문을 읽다가 흥미로운 텍스트를 발견하면 하이라이트합니다. Threddy는 자동으로 포함된 참조들을 검색하고, 각각의 메타데이터를 추출하여 사이드바에 인터랙티브 객체로 표시합니다. Sam은 제목과 TL;DR 요약을 보고 관련성이 낮은 참조들을 제거하고, 나머지를 'Reifying ephemeral user interaction'이라는 새로운 스레드로 저장합니다. 이후 다른 논문으로 이동해도 사이드바에서 스레드가 유지되어 맥락을 잃지 않고 계속 작업할 수 있습니다.

## System Architecture
Threddy는 크롬 브라우저 확장으로 구현된 프론트엔드와 Flask 서버 기반의 백엔드로 구성됩니다. GROBID를 사용하여 PDF를 파싱하고, 사용자가 하이라이트한 텍스트의 좌표를 기반으로 해당 문장과 참조를 찾습니다. Semantic Scholar API를 통해 논문 메타데이터를 가져오고, SPECTER 임베딩을 사용하여 의미적 유사성을 계산합니다. 추천 시스템은 스레드에 포함된 논문들을 가장 많이 인용한 최근 논문들을 찾아 제공합니다.

## Key Visualizations and Features
Threddy의 주요 시각화 요소는 다음과 같습니다:

1. **이중 패널 레이아웃**: 왼쪽에 PDF 뷰어와 하이라이터, 오른쪽에 스레드 관련 콘텐츠를 담은 사이드바
2. **홀딩 탱크 (Holding Tank)**: 하이라이트된 텍스트와 자동 추출된 참조들을 임시로 보여주는 영역
3. **스레드 선택기 (Thread Selector)**: 새 스레드를 생성하거나 기존 스레드를 선택하는 인터페이스
4. **스레드 드로어 (Thread Drawer)**: 계층적으로 조직된 스레드들을 보여주는 영역으로, 드래그 앤 드롭으로 재구성 가능
5. **Overview and Discovery 패널**: 선택된 스레드의 전체 내용을 펼쳐서 보여주고, 관련 논문 추천을 제공하는 전체 화면 뷰

각 시각화는 다음과 같은 문헌 리뷰 측면을 지원합니다:
- 하이라이트와 자동 추출: 읽기 흐름을 중단하지 않고 관련 참조를 수집
- 계층적 스레드 구조: 연구 주제의 mental model을 반영하여 조직
- 지속적인 사이드바: 논문 간 이동 시에도 맥락 유지
- 스레드별 추천: 각 스레드와 관련된 새로운 논문 발견 지원

## Evaluation
9명의 연구자를 대상으로 Google Docs와 비교하는 within-subject 연구를 수행했습니다. 참가자들은 Threddy에서 유의미하게 더 많은 클립(평균 9.9개 vs 4.9개)과 참조(평균 20.4개 vs 7.9개)를 수집하고 조직했습니다. NASA-TLX로 측정한 전체 작업 부담은 차이가 없었으나, flow 상태는 Threddy에서 유의미하게 높았습니다. 참가자들은 자동 참조 추출이 시간을 절약하고, 지속적인 스레드가 맥락 인식을 향상시키며, 스레드별 추천이 관련 논문 발견에 도움이 된다고 보고했습니다.

## Discussion
Threddy는 전통적인 paper-first 접근에서 thread-first 탐색으로의 전환을 가능하게 합니다. 사용자는 개별 논문에 집중하기보다 스레드를 중심으로 문헌을 탐색하고 조직할 수 있습니다. 시스템은 on-the-go foraging과 structuring을 지원하여 초기 sensemaking 과정에서 특히 유용합니다. 그러나 장기간 사용 시 스케일링 문제, 스레드의 재구성 필요성, 인용 체이닝을 넘어선 다양한 발견 메커니즘의 필요성 등이 향후 연구 과제로 제시되었습니다.

## BibTeX Entry
```bibtex
@inproceedings{kang2022threddy,
  title={Threddy: An Interactive System for Personalized Thread-based Exploration and Organization of Scientific Literature},
  author={Kang, Hyeonsu B. and Chang, Joseph Chee and Kim, Yongsung and Kittur, Aniket},
  booktitle={The 35th Annual ACM Symposium on User Interface Software and Technology (UIST '22)},
  pages={1--15},
  year={2022},
  organization={ACM},
  doi={10.1145/3526113.3545660}
}
```