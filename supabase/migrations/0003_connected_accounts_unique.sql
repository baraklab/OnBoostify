-- Allows re-connecting the same external account (e.g. after a token
-- expires) to update the existing row instead of creating a duplicate.
alter table connected_accounts
  add constraint connected_accounts_user_platform_external_unique
  unique (user_id, platform, external_account_id);
