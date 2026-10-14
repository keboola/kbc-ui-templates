# SurveyMonkey

Component ID: `kds-team.ex-survey-monkey`

Extracts surveys, survey details, responses and collectors from the
[SurveyMonkey API v3](https://developer.surveymonkey.com/api/v3/).

This component is a configuration template for [Generic Extractor](https://github.com/keboola/generic-extractor).
It has no code of its own: the files in this folder define the API connection (`api.json`)
and the predefined configurations (`config/*.json`) that Generic Extractor runs.

## Prerequisites

- A SurveyMonkey account and an access token from your SurveyMonkey developer account settings.

## Configuration

| Parameter | Required | Description |
|---|---|---|
| API Access Token (`#access_token`) | yes | Sent as `Authorization: Bearer <token>`. |

Both templates use full load: the tables are overwritten on every run.

## Templates

| Template | Downloads |
|---|---|
| Basic | Surveys, survey details with their pages, and bulk responses. |
| Collectors | Surveys, their collectors and collector statistics. |

## Output tables

| Table | Template | API endpoint | Primary key |
|---|---|---|---|
| `surveys` | both | `surveys` | `id` |
| `survey_details` | Basic | `surveys/{id}/details` | `id` |
| `survey_details_pages` | Basic | nested `pages` of survey details | – |
| `survey_responses` | Basic | `surveys/{id}/responses/bulk` | `id` |
| `survey_response_pages` | Basic | nested `pages` of each response | – |
| `survey_collectors_bridge` | Collectors | `surveys/{id}/collectors` | – |
| `survey_collectors` | Collectors | `collectors/{id}` | `id` |
| `survey_collectors_stats` | Collectors | `collectors/{id}/stats` | – |

## Troubleshooting

If a child request fails (for example, for one survey you cannot access), switch the configuration
to the JSON editor and add a
[filter](https://developers.keboola.com/extend/generic-extractor/configuration/config/jobs/children/#filter)
or [ignore the error](https://developers.keboola.com/extend/generic-extractor/configuration/api/#ignore-errors).

## Files

- `api.json`: base URL, `Authorization` header and pagination (`links.next`).
- `config/01-basic.json`: the Basic template.
- `config/02-collectors.json`: the Collectors template.
