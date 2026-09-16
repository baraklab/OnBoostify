alter table profiles
  add column notification_preferences jsonb not null default '{
    "scheduled_post_published": true,
    "workflow_failed": true,
    "weekly_summary": false
  }'::jsonb;
