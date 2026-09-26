-- =============================================================================
-- Kiambu Road Explorer — Migration 029
-- "Community Programmes" is renamed (display only) to "Community Projects",
-- and community_programmes gains rich long-form content fields so each
-- project can carry a full campaign page (tagline, structured body copy,
-- and a link into the Partner With Us donate form). Seeds the two initial
-- campaigns: Safe Kiambu Road and Clean Kiambu Road.
-- Run AFTER 028_partner_with_us.sql
-- =============================================================================

UPDATE journal_sections SET name = 'Community Projects' WHERE slug = 'business-opportunities';

ALTER TABLE community_programmes
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS body_content text,
  ADD COLUMN IF NOT EXISTS donate_project_label text;

-- body_content is plain text with a simple convention rendered on the public
-- detail page: a line starting with "## " is a subheading, consecutive lines
-- starting with "- " form a bullet list, and blank-line-separated blocks are
-- paragraphs. This keeps the admin editor a plain textarea while still
-- supporting the structured campaign copy below.

INSERT INTO community_programmes (name, slug, tagline, description, body_content, donate_project_label, status, sort_order)
VALUES
(
  'Safe Kiambu Road',
  'safe-kiambu-road',
  'Road Safety for Better Living',
  'Our campaign to end open defiance of traffic rules and abuse of collective decency on Kiambu Road, especially by public service vehicles.',
  E'Every road user has a stake in road safety. That is almost all of us - motorists, pedestrians, schoolchildren, parents, cyclists, boda riders, businesses, delivery riders and public transport users all encounter the road every day.\n\nBesides, every sector of life benefits from safe roads – social life, business, education, walking, cycling.\n\nOur campaign aims to bring to an end the culture of open defiance of traffic rules and deliberate abuse of collective decency, especially by public service vehicles\n\n## Manifests in many ways\n- Defiance of traffic laws\n- Rudeness and contempt for other road users through obstruction and overlapping\n- Driving on the pedestrian pavements and road shoulders\n- Rude and antisocial touting at bus stops\n\n## It''s time for a change\n\nThis crisis is serious and needs to be tackled by all stakeholders\n\nOur campaign calls on the county government to withdraw licenses for PSV companies involved in road\n\nAnd to outlaw touting of passengers at bus stops, which is a social menace. Letting this vice continue is not creating employment for the youth – the youth are the greatest victims\n\n## Safe Kiambu Road\n\nWe shall engage the county government, NTSA, Kenya Police, schools, transport operators and businesses towards the following goals:\n- Stricter enforcement of traffic rules on Kiambu Road\n- Uniform application of the law to all motorists, including PSVs\n- Elimination of touting – unless standards of conduct are developed and enforced across the board\n- Holding of traffic police accountable for wanton defiance of driving regulations by PSVs\n\n## Activities that need your support\n- Pedestrian safety awareness\n- Schoolchildren''s road-safety education\n- Responsible driving campaign\n- Visibility campaigns for pedestrians and cyclists\n- Mapping dangerous crossing points and accident hotspots\n- Advocating for pedestrian crossings, signage, lighting and speed management\n- Reflective materials for schoolchildren/cyclists\n- "Drive Safely – Kiambu Road" campaigns\n- Recognition of businesses that adopt road-safety measures',
  'Road safety campaign',
  'published',
  1
),
(
  'Clean Kiambu Road',
  'clean-kiambu-road',
  'A cleaner road. A better neighbourhood',
  'Help us clean and green Kiambu Road — tackling litter, deforestation and open sewers through collective community action.',
  E'Appeal: Help us clean and green Kiambu Road\n\nKiambu Road is a corridor of unparalleled ecological beauty, blissful residences and economic enterprise\n\nWe need to preserve it as a place of beauty, peaceful living, leisure and thriving commerce\n\nBut there is a problem. The road and rivers are litter-strewn, trees are being destroyed for construction without corresponding afforestation, and there are open sewers all over\n\nAll this creates suboptimal living and business conditions, leaving communities and visitors feeling frustrated, ignored and unsafe.\n\nHelp us tackle the menace today. We are leading the way in demanding tougher enforcement of environmental laws.\n\nBut most importantly, mobilising residents to take collective action to keep Kiambu Road clean and green\n\nWhile working closely with the county government, we want to mobilise:\n- Residents\n- Schools\n- Restaurants\n- Shopping Malls\n- Supermarkets\n- Property Managers\n- Churches\n- Businesses\n- Youth Groups\n\nThat''s why we need your support today.\n\nYour donation will help us:\n- Expose the true scale of the problem through research and surveys\n- Campaign for stronger enforcement and better visitor management\n- Amplify the voices of communities and volunteers\n- Hold public bodies to account\n\nUltimately, and with your support, our campaign will go beyond just picking up rubbish.\n\nWe shall work towards:\n- Better litter management\n- Waste segregation and recycling\n- Tree planting\n- Landscaping and beautification of public spaces\n- Drainage maintenance\n- Rivers and wetlands conservation',
  'Clean Kiambu Road campaign',
  'published',
  2
)
ON CONFLICT (slug) DO NOTHING;
