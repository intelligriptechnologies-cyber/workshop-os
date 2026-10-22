import {createDefaultAdminDemoState, ADMIN_PAGE_GROUPS, APP_THEME_FONTS, APP_THEME_PALETTES} from '../../src/admin-demo-state';
import {writeFileSync} from 'node:fs';
import {REPORT_PLACEHOLDERS, LINE_PLACEHOLDERS} from '../../src/report-templates';
writeFileSync('backend/customer-slice/admin-defaults.json', JSON.stringify(createDefaultAdminDemoState(),null,2)+'\n');
writeFileSync('backend/customer-slice/admin-options.json', JSON.stringify({pages:ADMIN_PAGE_GROUPS.flatMap(g=>g.pages.map(p=>p.key)),fonts:APP_THEME_FONTS.map(f=>f.id),palettes:APP_THEME_PALETTES.map(p=>p.id),placeholders:REPORT_PLACEHOLDERS,linePlaceholders:LINE_PLACEHOLDERS},null,2)+'\n');
