// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'DevOps Mortals | Wiki',
  tagline: 'DevOps notes, tutorials & resources',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://wiki.devopsmortals.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nyukeit', // Usually your GitHub org/user name.
  projectName: 'DevOps Wiki', // Usually your repo name.

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/coverimage-wiki.png',
      navbar: {
        title: 'Wiki by DevOps Mortals',
         logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/nyukeit/DevOpsWiki',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Wiki',
                to: '/',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
          {
            title: 'Connect With Me',
            items: [
              {
                label: 'LinkedIn',
                href: 'https://linkedin.com/in/nyukeit',
              },
              {
                label: 'Mastodon',
                href: 'https://fosstodon.org/@nyukeit',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/nyukeit',
              },
            ],
          },
          {
            title: 'Other Blogs',
            items: [
              {
                label: 'Medium',
                href: 'https://medium.com/@nyukeit',
              },
              {
                label: 'Hashnode',
                href: 'https://hashnode.com/@nyukeit',
              },
              {
                label: 'Dev.to',
                href: 'https://dev.to/@nyukeit',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Nyukeit.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
