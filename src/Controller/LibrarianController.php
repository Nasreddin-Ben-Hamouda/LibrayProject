<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class LibrarianController extends AbstractController
{
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager=$manager;
    }
    /**
     * @Route("/librarian/books", name="showBooks",methods={"GET"})
     */
    public function showBooks()
    {
        return $this->render('librarian/books.html.twig',[]);
    }

}
