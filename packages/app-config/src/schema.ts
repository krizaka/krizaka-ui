/**
 * The tables of the contract, for a Next.js backend's own migration. The same DDL ships with the Java
 * building block (`krizaka-app-config-schema.sql`): one schema, whichever stack serves it.
 */
export const schemaSql = `CREATE TABLE IF NOT EXISTS app_config (
    platform              VARCHAR(16)  PRIMARY KEY,
    min_supported_version VARCHAR(32)  NOT NULL DEFAULT '0.0.0',
    latest_version        VARCHAR(32)  NOT NULL DEFAULT '0.0.0',
    update_override       VARCHAR(8),
    store_url             TEXT,
    maintenance_on        BOOLEAN      NOT NULL DEFAULT FALSE,
    maintenance_message   JSONB        NOT NULL DEFAULT '{}'::jsonb,
    message               JSONB        NOT NULL DEFAULT '{}'::jsonb,
    contract_min          INTEGER      NOT NULL DEFAULT 1,
    contract_max          INTEGER      NOT NULL DEFAULT 1,
    contract_sunset       DATE,
    flags                 JSONB        NOT NULL DEFAULT '{}'::jsonb,
    revision              INTEGER      NOT NULL DEFAULT 1,
    updated_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_by            VARCHAR(255) NOT NULL DEFAULT 'seed',
    CONSTRAINT app_config_platform_known CHECK (platform IN ('ios', 'android', 'macos', 'windows', 'linux', 'web')),
    CONSTRAINT app_config_contract_range CHECK (contract_min >= 1 AND contract_max >= contract_min)
);

CREATE TABLE IF NOT EXISTS app_config_history (
    id                    BIGSERIAL    PRIMARY KEY,
    platform              VARCHAR(16)  NOT NULL,
    revision              INTEGER      NOT NULL,
    min_supported_version VARCHAR(32)  NOT NULL,
    latest_version        VARCHAR(32)  NOT NULL,
    update_override       VARCHAR(8),
    store_url             TEXT,
    maintenance_on        BOOLEAN      NOT NULL,
    maintenance_message   JSONB        NOT NULL,
    message               JSONB        NOT NULL,
    contract_min          INTEGER      NOT NULL,
    contract_max          INTEGER      NOT NULL,
    contract_sunset       DATE,
    flags                 JSONB        NOT NULL,
    reason                TEXT         NOT NULL,
    changed_by            VARCHAR(255) NOT NULL,
    changed_at            TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT app_config_history_revision UNIQUE (platform, revision)
);

INSERT INTO app_config (platform)
VALUES ('ios'), ('android'), ('macos'), ('windows'), ('linux'), ('web')
ON CONFLICT (platform) DO NOTHING;
`;
