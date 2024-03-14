import { QrCodeGeneratorService } from './qr-code-generator.service'

describe('QrCodeGeneratorService', function () {
  it('Generates QR code string in base64 PNG', async () => {
    const service = new QrCodeGeneratorService()

    const result = await service.generateAsBase64png('TEST')

    expect(result).toMatchInlineSnapshot(
      `"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAklEQVR4AewaftIAAAPTSURBVO3BUYocShIEQY+k73/l2If+k6qFUjMj3CxA0R9teSUJP1FbbiRBMEhaDZJWg6TVIGk1SFoNklaDpNUgaTVIWn241JbfLAnf1JYbSThpy0/Ult8sCSeDpNUgaTVIWg2SVoOk1SBpNUhaDZJWg6TVh8eS8E1t+bYknLTllSS80pZvS8I3teWVQdJqkLQaJK0GSatB0mqQtBokrQZJq0HSapC0GiStBkmrQdJqkLQaJK0GSatB0mqQtPqgvyIJN9ryShL01iBpNUhaDZJWg6TVIGk1SFoNklaDpNWHx9qit5Jwoy0/UVt+q0HSapC0GiStBkmrQdJqkLQaJK0GSatB0urDpSToXltuJOGkLTeScNKWV5LwrxskrQZJq0HSapC0GiStBkmrQdJqkLRK/4P+L0k4aYt+v0HSapC0GiStBkmrQdJqkLQaJK0GSatB0ipAudCWG0n4rdryShJutOUkCTfa8koSfqu2vDJIWg2SVoOk1SBpNUhaDZJWg6TVIGn14Qdry0kSbrTllST8REn4prb8REl4ZZC0GiStBkmrQdJqkLQaJK0GSatB0mqQtEr/w5cl4UZbXknCb9WWG0k4acuNJLzSlm9Kwo22nAySVoOk1SBpNUhaDZJWg6TVIGk1SFoFKBfa8q9Lwre15SQJP1Fbvi0JJ225kYSTQdJqkLQaJK0GSatB0mqQtBokrQZJq0HS6sNjSThpy40k/FZteaUtN5Jw0pZXknCjLSdJ+La2nAySVoOk1SBpNUhaDZJWg6TVIGk1SFp92vJSW15py0+UhFeScNKWf11bbiThJAk32nIySFoNklaDpNUgaTVIWg2SVoOk1SBpNUhaBSj6oy2vJOHb2nKShBtteSUJJ215JQk32nIySFoNklaDpNUgaTVIWg2SVoOk1SBp9eFSW36zJLyShJO2/ERteSUJ35aEk7bcSMLJIGk1SFoNklaDpNUgaTVIWg2SVoOk1SBp9eGxJHxTW/51SbjRlpMk3GjLSVtuJOEnasvJIGk1SFoNklaDpNUgaTVIWg2SVoOk1Qf9FUm40ZZXkvBKEk7acqMtJ0m40ZZvGiStBkmrQdJqkLQaJK0GSatB0mqQtBokrT7or2jLK225kYSTttxIwkkSbrTlpC0/0SBpNUhaDZJWg6TVIGk1SFoNklaDpNWHx9ryr2vLSRJ+oiS80pZXknCjLa8k4WSQtBokrQZJq0HSapC0GiStBkmrQdJqkLQKUPRHW24k4ZW2vJKEk7a8koQbbXklCSdteWWQtBokrQZJq0HSapC0GiStBkmrQdLqfzBc+3/EDswBAAAAAElFTkSuQmCC"`,
    )
  })

  it('Generates QR code string in SVG code', async () => {
    const service = new QrCodeGeneratorService()

    const result = await service.generateAsSvgCode('TEST')

    expect(result).toMatchInlineSnapshot(`
      "<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"200\\" height=\\"200\\" viewBox=\\"0 0 21 21\\" shape-rendering=\\"crispEdges\\"><path fill=\\"#ffffff\\" d=\\"M0 0h21v21H0z\\"/><path stroke=\\"#000000\\" d=\\"M0 0.5h7m2 0h4m1 0h7M0 1.5h1m5 0h1m3 0h1m3 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h1m1 0h3m1 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h2m2 0h1m1 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m1 0h2m1 0h1m2 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h1M0 8.5h1m1 0h5m2 0h1m1 0h1m2 0h5M0 9.5h1m1 0h2m1 0h1m2 0h2m1 0h4m4 0h2M3 10.5h1m2 0h5m1 0h1m1 0h2m3 0h1M0 11.5h1m6 0h3m1 0h4m3 0h1m1 0h1M0 12.5h1m1 0h1m1 0h5m3 0h1m2 0h1m1 0h2M8 13.5h1m1 0h1m1 0h1m2 0h1m2 0h2M0 14.5h7m2 0h3m1 0h1m2 0h1m2 0h1M0 15.5h1m5 0h1m1 0h1m6 0h2m1 0h1m1 0h1M0 16.5h1m1 0h3m1 0h1m1 0h1m2 0h1m1 0h1m2 0h1m1 0h1M0 17.5h1m1 0h3m1 0h1m1 0h2m1 0h4m2 0h1M0 18.5h1m1 0h3m1 0h1m1 0h1m3 0h1m1 0h2M0 19.5h1m5 0h1m2 0h6m2 0h1m2 0h1M0 20.5h7m1 0h2m2 0h1m2 0h1m2 0h1\\"/></svg>
      "
    `)
  })
})
