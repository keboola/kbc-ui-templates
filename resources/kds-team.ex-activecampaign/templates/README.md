# ActiveCampaign

Component ID: `kds-team.ex-activecampaign`

Extracts contacts, accounts, deals, campaigns, messages and automations from the
[ActiveCampaign API v3](https://developers.activecampaign.com/reference/overview).

This component is a configuration template for [Generic Extractor](https://github.com/keboola/generic-extractor).
It has no code of its own: the files in this folder define the API connection (`api.json`)
and the predefined configurations (`config/*.json`) that Generic Extractor runs.

## Prerequisites

- An ActiveCampaign account.
- An API token: in ActiveCampaign, go to **Settings → Developer**.
- The account name: the first part of your API URL, for example `ACCOUNT_NAME` in
  `https://ACCOUNT_NAME.api-us1.com/api/3/`.

## Configuration

| Parameter | Required | Description |
|---|---|---|
| API Token (`#apiKey`) | yes | ActiveCampaign API token. Sent in the `Api-Token` header. |
| Account Name (`accountName`) | yes | Account name from your API URL. |
| Load type (`incrementalOutput`) | yes | **Full load** overwrites the tables. **Incremental update** upserts rows by primary key. |
| Updated since (`updated_since`) | yes (can be empty) | Download only records updated since this date. Accepts `YYYY-MM-DD` or a relative value such as `-1 day` or `yesterday`. Empty = all records. |

`Updated since` applies only to Contacts, Accounts, Deals and Campaigns.
Messages, Automations and campaign links are always downloaded in full.

To remove deleted records from Storage, use **Full load** with an empty **Updated since**.

## Templates

| Template | Downloads |
|---|---|
| Contacts + Accounts + Deals + Campaigns + Messages + Automations | All the endpoints listed below. |
| Unsubscribed Contacts Only | Only contacts with `status = 2` (unsubscribed). `Updated since` is not applied. |

## Output tables

| Table | API endpoint | Primary key |
|---|---|---|
| `contacts` | `contacts` | `id` |
| `accounts` | `accounts` | `id` |
| `deals` | `deals` | `id` |
| `campaigns` | `campaigns` | `id` |
| `link_details` | `campaigns/{id}/links` (for each campaign) | `id` |
| `messages` | `messages` | `id` |
| `automations` | `automations` | `id` |

Records are paged by 100 (`limit` / `offset`).

## Custom fields

The templates map only the standard fields. To add custom fields, switch the configuration
to the JSON editor and extend the `mappings` section.
See [Generic Extractor mappings](https://developers.keboola.com/extend/generic-extractor/configuration/config/mappings/).

## Files

- `api.json`: base URL, `Api-Token` header and pagination.
- `config/01-accounts-and-contacts.json`: the full template.
- `config/02-unsubscribed-contacts.json`: unsubscribed contacts only.
