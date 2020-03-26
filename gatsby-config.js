module.exports = {
  siteMetadata: {
    url: 'https://evle.netlify.com',
    title: 'EVLE',
    subtitle: 'Knowledge is not consumed, it is shared',
    copyright: '© All rights reserved.',
    disqusShortname: '',
    menu: [
      {
        label: 'Articles',
        path: '/'
      },
      {
        label: 'About me',
        path: '/about/'
      }
      // {
      //   label: 'Contact me',
      //   path: '/contact/'
      // }
    ],
    author: {
      name: 'evle',
      email: 'evlefsp@163.com',
      telegram: '#',
      twitter: '#',
      github: 'evle',
      rss: 'rss.xml',
      vk: '#'
    }
  },
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages'
      }
    },
    // {
    //   resolve: 'gatsby-plugin-feed',
    //   options: {
    //     query: `
    //       {
    //         site {
    //           siteMetadata {
    //             site_url: url
    //             title
    //             description: subtitle
    //           }
    //         }
    //       }
    //     `,
    //     feeds: [
    //       {
    //         serialize: ({ query: { site, allMarkdownRemark } }) => (
    //           allMarkdownRemark.edges.map(edge =>
    //             Object.assign({}, edge.node.frontmatter, {
    //               description: edge.node.frontmatter.description,
    //               date: edge.node.frontmatter.date,
    //               url: site.siteMetadata.site_url + edge.node.fields.slug,
    //               guid: site.siteMetadata.site_url + edge.node.fields.slug,
    //               custom_elements: [{ 'content:encoded': edge.node.html }]
    //             }))
    //         ),
    //         query: `
    //           {
    //             allMarkdownRemark(
    //               limit: 1000,
    //               sort: { order: DESC, fields: [frontmatter___date] },
    //               filter: { frontmatter: { layout: { eq: "post" }, draft: { ne: true } } }
    //             ) {
    //               edges {
    //                 node {
    //                   html
    //                   fields {
    //                     slug
    //                   }
    //                   frontmatter {
    //                     title
    //                     date
    //                     layout
    //                     draft
    //                     description
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         `,
    //         output: '/rss.xml'
    //       }
    //     ]
    //   }
    // },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: { maxWidth: 960 }
          },
          {
            resolve: 'gatsby-remark-responsive-iframe',
            options: { wrapperStyle: 'margin-bottom: 1.0725rem' }
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants'
        ]
      }
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-offline',
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss-sass'
  ]
};
