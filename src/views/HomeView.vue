<template>
	<header>
		<span class="brand-name">Plansly</span>
		<div class="links">
			<RouterLink to="/auth/login">Login</RouterLink>
			<RouterLink to="/auth/register"
				class="primary-link">Register</RouterLink>
		</div>
	</header>
	<main>
		<section class="welcome-hero">
			<div class="section-content-container">
				<img src="/HomeHero.png" />
				<div class="content">
					<h1>Streamline your study routine with Plansly!</h1>
					<p>
						Get ahead in your studies with Plansly. Our app helps you easily
						manage tasks, set priorities, and track progress. Upgrade your study
						game today!
					</p>
					<div class="link-container">
						<RouterLink to="/auth/register"
							class="primary-link">Get Started</RouterLink>
						<RouterLink to="/auth/login">
							Already have an account?
							<font-awesome-icon icon="fa-solid fa-right-to-bracket" />
						</RouterLink>
					</div>
				</div>
			</div>
		</section>
		<section class="features-section">
			<div class="section-content-container">
				<h2>Key Features</h2>
				<div class="features">
					<div class="feature">
						<h3>Manage Tasks</h3>
						<p>
							Create tasks that clearly describe it's purpose, and change them
							as much as you'd like.
						</p>
					</div>
					<div class="feature">
						<h3>Link Tasks to Create Dependencies</h3>
						<p>Link tasks together to show a required order of completion.</p>
					</div>
					<div class="feature">
						<h3>Multiple Views</h3>
						<p>
							Choose from either a board view or a task view, to suit your
							needs.
						</p>
					</div>
				</div>
			</div>
		</section>
	</main>
	<footer>
		<span>Plansly</span>
		<span>Developed for my final project at Aberystwyth University</span>
		<a href="https://github.com/jamiegreg78/Plansly">GitHub</a>
	</footer>
</template>

<script setup lang="ts"></script>

<style lang="scss">
header {
	position: sticky;
	top: 0px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	padding: toRem(16);
	border-bottom: 1px solid var(--border);

	backdrop-filter: blur(4px);

	.brand-name {
		font-size: toRem(28);
		font-weight: 700;
		color: var(--text-primary);
	}

	.links {
		display: flex;
		align-items: center;
		gap: toRem(16);

		a {
			font-size: toRem(16);
			font-weight: 600;
			color: var(--text-primary);
			text-decoration: none;
		}

		.primary-link {
			padding: toRem(8);

			background-color: var(--primary);
			border-radius: 8px;
			color: var(--white);
			font-weight: 700;

			&:hover {
				background-color: var(--primary-hover);
			}
		}
	}
}

main {
	color: var(--text-primary);

	section {
		padding: toRem(64) toRem(16);

		h2 {
			margin: 0;
			margin-bottom: toRem(16);
		}

		.section-content-container {
			text-align: center;

			@include breakpoint(tablet) {
				max-width: toRem(800);
				margin: auto;
				text-align: left;
			}
		}
	}

	.welcome-hero {
		background-color: var(--background);

		.section-content-container {
			@include breakpoint(tablet) {
				padding-top: toRem(64);
				padding-bottom: toRem(64);
				display: flex;
				flex-direction: row-reverse;
				max-width: toRem(800);
				margin: auto;
			}

			.content {
				@include breakpoint(tablet) {
					padding: toRem(16);
					padding-left: 0;
				}

				@include breakpoint(desktop) {
					padding: toRem(32);
					padding-left: 0;
				}

				h1 {
					margin: 0;
					font-weight: 600;
				}

				p,
				h1 {
					text-align: center;

					@include breakpoint(tablet) {
						text-align: left;
					}
				}

				.link-container {
					display: flex;
					flex-direction: column;
					align-items: center;
					gap: toRem(4);

					@include breakpoint(tablet) {
						flex-direction: row;
						align-items: center;
						gap: toRem(16);
					}

					a {
						display: block;
					}

					a:not(.primary-link) {
						width: fit-content;
						text-decoration: none;
						color: var(--text-primary);
						transition: color 0.3s ease;

						&::after {
							content: '';
							display: block;
							width: 0;
							height: 2px;
							background-color: var(--primary);
							transition: width 0.15s ease-in-out;
						}

						&:hover {
							color: var(--primary-hover);

							&::after {
								width: 100%;
							}
						}
					}

					.primary-link {
						width: fit-content;
						padding: toRem(8);
						text-decoration: none;

						border-radius: 8px;
						color: var(--text-primary);
						border: 1px solid var(--border);
						font-weight: 700;

						&:hover {
							background-color: var(--background-inset);
						}
					}
				}
			}
		}

		img {
			display: block;
			max-width: toRem(300);
			margin: auto;
			margin-bottom: toRem(48);

			@include breakpoint(tablet) {
				flex-shrink: 2;
				max-width: toRem(300);
				padding: 0;
				margin-bottom: auto;
				margin-left: toRem(16);
			}
		}
	}

	.features-section {
		color: white;
		background-color: var(--primary);

		.features {
			display: flex;
			flex-direction: column;
			gap: toRem(16);

			@include breakpoint(tablet) {
				flex-direction: row;
				justify-content: space-between;
			}

			.feature {
				padding: toRem(16);
				text-align: center;

				h3 {
					margin: 0;
				}

				color: var(--text-primary);
				background-color: var(--background);
				border-radius: 8px;

				@include drop-shadow;

				@include breakpoint(tablet) {
					width: 33%;
				}
			}
		}
	}
}

footer {
	width: 100%;
	padding: toRem(16);
	background-color: var(--background-dark);
	color: var(--text-dark-background);

	span,
	a {
		display: block;
	}

	a {
		color: var(--primary);
	}
}
</style>
