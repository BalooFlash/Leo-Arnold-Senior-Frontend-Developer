import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
        }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                childImageSharp {
                  gatsbyImageData(width: 700, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
                }
              }
              github
              external
            }
            html
          }
        }
      }
    }
  `);
  
  const featuredProjects = data.projects.edges.filter(({ node }) => node);
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Projects
      </h2>

      {/* <StyledProject> */}
      {featuredProjects &&
        featuredProjects.map(({ node }, i) => {
          const { frontmatter } = node;
          const { external, title,  github, cover } = frontmatter;
          const image = getImage(cover);

          return (
            <div key={i} ref={el => (revealProjects.current[i] = el)}>
              <div className="project-content">
                <div>
                  {/* <p className="project-overline">Featured Project</p>

                  <h3 className="project-title">
                    <a href={external}>{title}</a>
                  </h3> */}

                

                  

                  {/* <div className="project-links">
                    {cta && (
                      <a href={cta} aria-label="Course Link" className="cta">
                        Learn More
                      </a>
                    )}
                    {github && (
                      <a href={github} aria-label="GitHub Link">
                        <Icon name="GitHub" />
                      </a>
                    )}
                    {external && !cta && (
                      <a href={external} aria-label="External Link" className="external">
                        <Icon name="External" />
                      </a>
                    )}
                  </div> */}
                </div>
              </div>

              <div className="project-image">
                <a href={external ? external : github ? github : '#'}>
                  <GatsbyImage image={image} alt={title} className="img" />
                  <br />
                  <br />
                </a>
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default Projects;
