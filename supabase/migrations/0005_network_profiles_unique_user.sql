-- Each user manages a single network listing via upsert from Settings/Network.
alter table network_profiles
  add constraint network_profiles_user_id_unique unique (user_id);
